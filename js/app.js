import { form } from "./modules/selectores.js";
import { validateForm } from "./modules/funciones.js";
import Calculator from "./modules/classes/Calculator.js";

form.addEventListener("submit", validateForm)

/* 
* Control de tiempos
const entrada = [];
const salida = [];
const relaciones = [];

for (let i = 1; i <= 50000; i++) {
    entrada.push('a' + i);
    salida.push('b' + i);
    relaciones.push(['a' + i, 'b' + i]);
}

const calc = new Calculator(entrada, salida, relaciones);
console.log('¿Es función?', calc.isFunction());
*/