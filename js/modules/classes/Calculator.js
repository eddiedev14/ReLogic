import UI from "./UI.js";

export default class Calculator{
    constructor(dominio, codominio, relaciones) {
        this.dominio = dominio;
        this.codominio = codominio;
        this.relaciones = relaciones; // [[a,b], [c, d]]
    }

    //*Método principal
    analizarEntradas() {
        console.time('Execution time');

        //Variables de resultado
        let relacionBinaria;
        let tipoRelacionBinaria;
        let funcionInversa = null;

        //* 1. Validar si es una funcion o relación
        relacionBinaria = this.esFuncion() ? "FUNCIÓN" : "RELACIÓN"; 

        //* 2. Se analiza el TIPO DE RELACION O FUNCION
        const cardinalidad = this.analizarCardinalidad();

        if (relacionBinaria === "FUNCIÓN") { //SI ES UNA FUNCION SU CLASIFICACION SERÁ POR TIPO (INYECTIVA -> 1:1, SOBREYECTIVA -> CODOMINIO = RANGO, BIYECTIVA -> Inyectiva y Sobreyectiva)
            if (cardinalidad === "1:1" && this.esCodominioRango()) {
                tipoRelacionBinaria = "es BIYECTIVA (INYECTIVA Y SOBREYECTIVA)";
                
                //Se calcula la inversa porque es biyectiva
                funcionInversa = this.calcularFuncionInversa();
            }else if (cardinalidad === "1:1") {
                tipoRelacionBinaria = "es INYECTIVA (1:1)";
            }else if (this.esCodominioRango()) {
                tipoRelacionBinaria = "es SOBREYECTIVA (CODOMINIO = RANGO)";
            }else{
                tipoRelacionBinaria = "no es NI INYECTIVA NI SOBREYECTIVA";
            }
        }else{
            tipoRelacionBinaria = cardinalidad; //SI ES UNA RELACIÓN SU CLASIFICACION SERÁ POR CARDINALIDAD
        }

        console.timeEnd('Execution time');

        // Se valida si puede ser construido el diagrama digital
        let elementosDiagrama = null;

        if (this.dominio.length <= 10 && this.codominio.length <= 10 && this.relaciones.length <= 10) {
            elementosDiagrama = [this.dominio, this.codominio, this.relaciones]
        }

        //Mostrar los resultados del análisis en UI
        UI.showResult(relacionBinaria, tipoRelacionBinaria, funcionInversa, elementosDiagrama);        
    }

    //* Método para validar si es funcion o no
    esFuncion(){
        const entrada = this.dominio;
        const relaciones = this.relaciones;

        //* 1. Extraer los primeros elementos de cada par ordenado
        const primeros = [];
        for (let i = 0; i < relaciones.length; i++) {
            primeros.push(relaciones[i][0]);
        }

        //* 2. Se valida la longitud de los arreglos, si son diferentes no es función parcialmente
        if (primeros.length !== entrada.length) {
            return false;
        }

        //* 3. Verificar que cada elemento de entrada tenga relación y tenga una ÚNICA IMAGEN
        for (let i = 0; i < entrada.length; i++) {
            let elemento = entrada[i];
            let contador = 0;

            // Contar cuántas veces aparece en primeros
            for (let j = 0; j < primeros.length; j++) {
                if (primeros[j] == elemento) {
                    contador++;
                }
            }

            // Si aparece más o menos de una vez el elemento no es funcion (NO ESTA RELACIONADO CON NINGUNO O TIENE MAS DE UNA IMAGEN)
            if (contador !== 1) {
                return false;
            }
        }

        return true; // Sí es función
    }

    // * Método para obtener CARDINALIDAD DE LA FUNCIÓN O RELACION
    analizarCardinalidad(){
        /*
        //* 1. Construir un objeto de entrada con la siguiente estructura, donde a, b, c son entradas y x, y, z salidas
            {
                "a": ["x"],
                "b": ["y", "z"],
                "c": ["x"]
            }

        //* 2. Construir un objeto de salida con la siguiente estructura, donde a, b, c son entradas y x, y, z salidas
            {
                "x": ["a", "c"],
                "y": ["b"],
                "z": ["b"]
            }
        */

        const entradas = {};
        const salidas = {};

        for (let i = 0; i < this.relaciones.length; i++) {
            const [a, b] = this.relaciones[i];
            
            if (!entradas[a]) { //Si no existe la clave de la entrada se crea un array vacio
                entradas[a] = []
            }
            entradas[a].push(b) //Se añade a la clave de entrada los distintos elementos de salida asociados

            if (!salidas[b]) { //Si no existe la clave de la salida se crea un array vacio
                salidas[b] = []
            }
            salidas[b].push(a) //Se añade a la clave de salida los distintos elementos de entrada asociados
        }

        //* Se obtiene la cardinalidad a partir de los objetos, tanto la de entrada como la de salida
        
        // Detectar si alguna entrada tiene múltiples salidas
        let entradaEsMuchos = false;
        const clavesEntradas = Object.keys(entradas);
        for (let i = 0; i < clavesEntradas.length; i++) {
            if (entradas[clavesEntradas[i]].length > 1) {
                entradaEsMuchos = true;
                break;
            }
        }

        // Detectar si alguna salida tiene múltiples entradas
        let salidaEsMuchos = false;
        const clavesSalidas = Object.keys(salidas);
        for (let i = 0; i < clavesSalidas.length; i++) {
            if (salidas[clavesSalidas[i]].length > 1) {
                salidaEsMuchos = true;
                break;
            }
        }

        // Determinar cardinalidad leida desde el dominio hacia el codominio
        if (entradaEsMuchos && salidaEsMuchos) return "*:*";
        if (entradaEsMuchos) return "1:*";
        if (salidaEsMuchos) return "*:1";
        return "1:1";
    }

    //* Método para validar si el codominio es el rango (TODOS LOS ELEMENTOS DE SALIDA ESTAN RELACIONADOS)
    esCodominioRango(){
        const salida = this.codominio;
        const relaciones = this.relaciones;

        //* 1. Extraer los segundos elementos de cada par ordenado
        const segundos = [];
        for (let i = 0; i < relaciones.length; i++) {
            segundos.push(relaciones[i][1]);
        }

        //* 3. Verificar que cada elemento de salida esté relacionado
        for (let i = 0; i < salida.length; i++) {
            let elemento = salida[i];
            let contador = 0;

            // Contar cuántas veces aparece en primeros
            for (let j = 0; j < segundos.length; j++) {
                if (segundos[j] == elemento) {
                    contador++;
                }
            }

            // Si aparece cero veces el elemento, el codominio no es rango
            if (contador === 0) {
                return false;
            }
        }

        return true; // Sí es rango
    }

    //* Método para calcular función inversa
    // Dada una función 𝑓: 𝐴→𝐵, la función inversa 𝑓−1:𝐵 → 𝐴 "invierte" la relación, es decir, para cada par (𝑎,𝑏) en 𝑓, en la inversa estará (𝑏,𝑎).
    // Pero solo existe la función inversa si 𝑓 biyectiva, porque la inversa también debe ser una función.
    
    calcularFuncionInversa(){
        // Se construye la función inversa invirtiendo los pares
        let resultado = "{";

        for (let i = 0; i < this.relaciones.length; i++) {
            const par = this.relaciones[i]; // [a, b]
            
            // Construir string de par invertido "[b, a]"
            resultado += "(" + par[1] + ", " + par[0] + ")";
            
            if (i !== this.relaciones.length - 1) {
                resultado += ", "; // Añadir coma menos al final
            }
        }

        resultado += "}";
        return resultado; 
    }
}