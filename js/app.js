import { form } from "./modules/selectores.js";
import { validateForm } from "./modules/funciones.js";
import Calculator from "./modules/classes/Calculator.js";

form.addEventListener("submit", validateForm)

/*
//* Control de tiempos
const entrada = [];
const salida = [];
const relaciones = [];

for (let i = 1; i <= 100; i++) {
        entrada.push('a' + i);
        salida.push('b' + i);
        relaciones.push(['a' + i, 'b' + i]); // función 1:1
}

const calc = new Calculator(entrada, salida, relaciones);
calc.analizarEntradas();
*/