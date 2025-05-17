import { regexListaDePares, regexListaSimple } from "./variables.js";
import { form } from "./selectores.js";
import Alert from "./classes/Alert.js";
import Calculator from "./classes/Calculator.js";

//* Función para validar formulario y formato del formulario
export function validateForm(e) {
    e.preventDefault();
    
    //* Obtenemos la información del formulario
    const data = Object.fromEntries(new FormData(form));
    const isEmpty = Object.values(data).some(campo => campo.trim() === "");

    if (isEmpty) {
        Alert.showAlert("¡Ops!", "El formulario tiene campos sin rellenar. Asegúrate de ingresar toda la información", "error");
        return;   
    }

    //* Validacion del formato de los campos del formulario
    const {setIn, setOut, relations} = data; //Destructuring

    if (!regexListaSimple.test(setIn) || !regexListaSimple.test(setOut)) {
        Alert.showAlert(
            "Formato inválido",
            "Los dos primeros campos deben tener el formato {a,b,c}, usando solo números y letras (sin ñ).",
            "error"
        );
        return;
    }

    if (!regexListaDePares.test(relations)) {
        Alert.showAlert(
            "Formato inválido",
            "El último campo debe tener el formato {(a,b), (c,d)} o estar vacío como {}. Solo se permiten letras y números.",
            "error"
        );
        return;
    }

    //* Se parsean y normalizan los datos del formulario
    const [setEntrada, setSalida, relaciones] = parseFields(setIn, setOut, relations);

    //* Se valida que no haya duplicados en los conjuntos de entrada y salida
    if (hasDuplicates(setEntrada) || hasDuplicates(setSalida)) {
        Alert.showAlert(
            "Duplicados detectados",
            "Los conjuntos de entrada y salida no deben contener elementos repetidos.",
            "error"
        );
        return;
    }

    //* Verificamos si los elementos de las relaciones están en los conjuntos y que no hayan pares identicos en las relaciones
    const errores = [];
    const paresRegistrados = {};

    //Se recorre cada elemento del arreglo de relaciones, es decir cada par (a,b)
    relaciones.forEach(rel => {
        //Se obtiene cada elemento del par ordenado (primera posicion y segunda posicion)
        const [a, b] = rel;

        //Se valida si el set de entrada incluye el primer elemento
        if (!setEntrada.includes(a)) {
            errores.push(`"${a}" no está en el conjunto de entrada.`); //Se añade un elemento al array de errores
        }

        //Se valida si el set de salida incluye el segundo elemento
        if (!setSalida.includes(b)) {
            errores.push(`"${b}" no está en el conjunto de salida.`); //Se añade un elemento al array de errores
        }

        //Se valida si hay pares identicos repetidos
        const clave = `${a},${b}`;
        if (paresRegistrados[clave]) {
            errores.push(`El par (${a},${b}) está repetido.`); //Se añade un elemento al array de errores
        }

        paresRegistrados[clave] = true; //Se añade la clave al objeto y se define como true
    });

    // Si hay errores (errores.length > 0), muestra la alerta
    if (errores.length > 0) {
        Alert.showAlert(
            "Relaciones inválidas",
            errores.join("\n"),
            "error"
        );
        return;
    }

    //* Se procede a generar el análisis
    const calc = new Calculator(setEntrada, setSalida, relaciones);
    calc.analizarEntradas();
}

function parseFields(setIn, setOut, relations) {
    const setEntrada = parseSetToArray(setIn);
    const setSalida = parseSetToArray(setOut);
    let relaciones = relations
        .replace(/[{}]/g, "") // Se quitan las llaves del dato ingresado: {(a, b), (c, d)} => (a,b), (c,d) 
        .match(/\([^)]+\)/g) || [] //Busca todas las subcadenas que empiezan con (, tienen uno o más caracteres que no sean ), y terminan con ). => ["(a,b)", "(c,d)", "(x,y)"], si no encuentra devuelve arreglo vacio
    
    //* Método Match => Es un método de las cadenas en JavaScript que busca todas las coincidencias que cumplen con una expresión regular y devuelve un array con esas coincidencias. 

    //*Se procede a crear arreglo bidimensional con elemento de entrada y salida por cada elemento del array [[a, b], [b, c]]
    //Se recorre cada elemento del arreglo original, es decir cada par (a,b)
    relaciones = relaciones.map(pair =>
        pair
        .replace(/[()]/g, "") // elimina paréntesis
        .split(",").map(e => e.trim()) // divide por coma y elimina espacios
    );

    //Retorna los elementos
    return [setEntrada, setSalida, relaciones];
}

//* Funcion para convertir los inputs en arrays
function parseSetToArray(input) {
    return input
    .replace(/[{}]/g, "") // Se quitan las llaves del dato ingresado: {a, b, c, d} => a, b, c, d
    .split(",") //Se crea un array separando los elementos por comas
    .map(e => e.trim()) //Se modifica el array para quitar espacios en blanco entre los elementos
    .filter(e => e !== ""); //Se filtra para obtener aquellos elementos que NO VACÍOS
}
    
//* Función para validar si un conjunto tiene duplicados
function hasDuplicates(arr) {
    const counts = {}; //Objeto que almacena cada elemento del conjunto y la cantidad de veces que aparecen
    for (const item of arr) { //Recorre cada elemento del array
        if (counts[item]) { //Significa que ya esta registrado, es decir está duplicado
            return true;
        }
        counts[item] = 1; //Añade el elemento y coloca el contador en 1
    }
    return false; // No encontró duplicados
}