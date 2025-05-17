import { diagramContainer, diagramSection, funcionInversaContainer, funcionInversaParagraph, relacionBinariaParagraph, resultContainer, spinner, tipoRelacionBinariaImg, tipoRelacionBinariaParagraph, tipoRelacionBinariaTitle } from "../selectores.js";

class UI{
    showResult(relacionBinaria, tipoRelacionBinaria, funcionInversa, elementosDiagrama = null){
        //* Relacion Binaria
        relacionBinariaParagraph.innerHTML = "La relación binaria entre los conjuntos es una ";
        const binaryRelationStrong = document.createElement("STRONG");
        binaryRelationStrong.textContent = relacionBinaria;
        relacionBinariaParagraph.appendChild(binaryRelationStrong);

        //* Tipo de Relación Binaria
        tipoRelacionBinariaTitle.textContent = `Tipo de ${relacionBinaria}`;

        const binaryRelationTypeStrong = document.createElement("STRONG");
        
        if (relacionBinaria === "FUNCIÓN") {
            tipoRelacionBinariaParagraph.textContent = "La función presentada "
            binaryRelationTypeStrong.textContent = tipoRelacionBinaria;
            tipoRelacionBinariaImg.src = "assets/svg/function.svg";
        }else{
            if (tipoRelacionBinaria !== "") {
                tipoRelacionBinariaParagraph.textContent = "La relación presentada está caracterizada por su cardinalidad: ";
                binaryRelationTypeStrong.textContent = tipoRelacionBinaria;
            }else{
                tipoRelacionBinariaParagraph.textContent = "La relación presentada no tiene relaciones entre sus conjuntos.";
            }

            binaryRelationTypeStrong.style.fontFamily = "Arial";
            tipoRelacionBinariaImg.src = "assets/svg/relation-type.svg";
        }

        tipoRelacionBinariaParagraph.appendChild(binaryRelationTypeStrong);

        //* Función Inversa
        if (funcionInversa) {
            funcionInversaContainer.classList.remove("hidden");
            funcionInversaParagraph.textContent = "Los pares ordenados de la función inversa son: ";
            
            const funcionInversaStrong = document.createElement("STRONG");
            funcionInversaStrong.style.fontFamily = "Arial";
            funcionInversaStrong.textContent = funcionInversa;
            funcionInversaParagraph.appendChild(funcionInversaStrong);
        }else{
            funcionInversaContainer.classList.add("hidden");
        }

        //* Construir diagrama sagital
        if (elementosDiagrama) {
            const [dominio, codominio, relaciones] = elementosDiagrama;
            this.dibujarDiagramSagital(dominio, codominio, relaciones);
        }else{
            diagramSection.classList.add("hidden")
        }
        
        setTimeout(() => {
            this.hideSpinner();
            resultContainer.classList.remove("hidden");
        }, 200);
    }

    dibujarDiagramSagital(dominio, codominio, relaciones){
        diagramContainer.innerHTML = ''; // Limpiar contenido anterior
        diagramContainer.style.position = 'relative';

        if (dominio.length > 7 || codominio.length > 7) {
            diagramContainer.style.height = "500px";
        }

        const leftSet = document.createElement('div');
        const rightSet = document.createElement('div');

        const alturaPorElemento = 50; // px
        const alturaMinima = 120;     // Altura mínima si hay pocos elementos
        const alturaCalculada = Math.max(alturaMinima, dominio.length * alturaPorElemento, codominio.length * alturaPorElemento);

        leftSet.style.position = 'absolute';
        leftSet.style.left = '40px';
        leftSet.style.top = '50px';
        leftSet.style.width = '120px';
        leftSet.style.border = '2px solid black';
        leftSet.style.borderRadius = '50%';
        leftSet.style.padding = '10px';
        leftSet.style.height = `${alturaCalculada}px`;
        leftSet.style.backgroundColor = "#ffece3";
        leftSet.style.zIndex = "-1";

        rightSet.style.position = 'absolute';
        rightSet.style.left = '300px';
        rightSet.style.top = '50px';
        rightSet.style.width = '120px';
        rightSet.style.border = '2px solid black';
        rightSet.style.borderRadius = '50%';
        rightSet.style.padding = '10px';
        rightSet.style.height = `${alturaCalculada}px`;
        rightSet.style.backgroundColor = "#f9e0e0";
        rightSet.style.zIndex = "-1";

        // Posicionar los elementos del dominio
        const posicionesDom = {};
        dominio.forEach((elem, i) => {
            const el = document.createElement('div');
            el.textContent = elem;
            el.style.position = 'absolute';
            el.style.left = '90px';
            el.style.top = `${80 + i * 40}px`;
            el.style.fontStyle = "italic";
            diagramContainer.appendChild(el);
            posicionesDom[elem] = el;
        });

        // Posicionar los elementos del codominio
        const posicionesCodom = {};
        codominio.forEach((elem, i) => {
            const el = document.createElement('div');
            el.textContent = elem;
            el.style.position = 'absolute';
            el.style.left = '350px';
            el.style.top = `${80 + i * 40}px`;
            diagramContainer.appendChild(el);
            posicionesCodom[elem] = el;
        });

        // Dibujar líneas SVG entre elementos
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '600');
        svg.setAttribute('height', alturaCalculada + 40);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        diagramContainer.appendChild(svg);

        relaciones.forEach(([dom, cod]) => {
            const start = posicionesDom[dom];
            const end = posicionesCodom[cod];

            if (!start || !end) return;

            const x1 = start.offsetLeft + 20;
            const y1 = start.offsetTop + 10;
            const x2 = end.offsetLeft - 5;
            const y2 = end.offsetTop + 10;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', 'blue');
            line.setAttribute('stroke-width', '2');
            svg.appendChild(line);
        });

        diagramContainer.appendChild(leftSet);
        diagramContainer.appendChild(rightSet);
    }

    hideResult(){
        resultContainer.classList.add("hidden");
    }

    showSpinner(){
        spinner.classList.remove("hidden");
    }
    
    hideSpinner(){
        spinner.classList.add("hidden");
    }
}

export default new UI();