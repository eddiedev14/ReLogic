//* regexListaSimple: Elementos entre llaves {}, Separados por comas, Cada elemento puede ser números (0-9) o letras del abecedario (a-z, A-Z)
export const regexListaSimple = /^\{\s*(-?[a-zA-Z0-9]+)(\s*,\s*-?[a-zA-Z0-9]+)*\s*\}$/;

//* regexListaDePares: Puede estar vacío: {}, Si no está vacío, deben ser pares entre paréntesis, Cada par con dos elementos (letra o número) separados por coma, Todo contenido dentro de llaves {}
export const regexListaDePares = /^\{\s*(\(\s*(-?\w+)\s*,\s*(-?\w+)\s*\)(\s*,\s*\(\s*(-?\w+)\s*,\s*(-?\w+)\s*\))*)?\s*\}$/;