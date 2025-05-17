export default class Calculator{
    constructor(dominio, codominio, relaciones) {
        this.dominio = dominio;
        this.codominio = codominio;
        this.relaciones = relaciones;
    }

    //*Método principal
    analyzeEntries() {
        //* 1. Validar si es una funcion o relacióm
        if (this.isFunction()) {
            console.log("✅ Es una función");
        } else {
            console.log("❌ No es una función. Es una relación.");
        }
    }

    //* Método para validar si es funcion o no
    isFunction(){
        console.time('isFunction execution time');

        const entrada = this.dominio;
        const relaciones = this.relaciones;
        

        //* 1. Extraer los primeros elementos de cada par ordenado
        const primeros = [];
        for (let i = 0; i < relaciones.length; i++) {
            primeros.push(relaciones[i][0]);
        }

        //* 2 Verificar que cada elemento de entrada tenga relación y tenga una ÚNICA IMAGEN
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
                console.timeEnd('isFunction execution time');
                return false;
            }
        }

        console.timeEnd('isFunction execution time');

        return true; // Sí es función
    }

    pruebaTiempo(){

    }
}