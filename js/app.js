import { form, resultContainer, screenshootBtn } from "./modules/selectores.js";
import { validateForm } from "./modules/funciones.js";

//Evento al enviar formulario
form.addEventListener("submit", validateForm)

//Evento al tomar captura
screenshootBtn.addEventListener("click", () => {
    html2canvas(resultContainer).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "relogic.png";
        link.click();
    });
})

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