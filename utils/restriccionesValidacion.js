import { validate } from "validate.js";

export const validarCadena = (id, valor) => {
    const restricciones = {
        presence: { allowEmpty: false, message: ": no puede estar vacío." },
    };
    if (valor !== "") {
        restricciones.format = {
            pattern: "[a-z' ']+",
            flags: "i",
            message: ": únicamente puede contener letras."
        }
    }
    const resuladoValidacion = validate({ [id]: valor }, { [id]: restricciones });
    return resuladoValidacion && resuladoValidacion[id];
}

export const validarNombreUsuario = (id, valor) => {
    const restricciones = {
        presence: { allowEmpty: false, message: ": no puede estar vacío" },

    };
    if (valor !== "") {
        restricciones.format = {
            pattern: "[a-z0-9]+",
            message: ": únicamente puede tener letras minúsculas y números; sin espacios."
        },
            restricciones.length = {
                maximum: 10,
                tooLong: ": tiene que ser de %{count} caracteres o menos",
            }
    }
    const resuladoValidacion = validate({ [id]: valor }, { [id]: restricciones });
    console.log(validate({ [id]: valor }, { [id]: restricciones }));
    return resuladoValidacion && resuladoValidacion[id];
}

export const validarCorreo = (id, valor) => {
    const restricciones = {
        presence: { allowEmpty: false, message: ": no puede estar vacío." },

    };
    if (valor !== "") {
        restricciones.email = {
            message: "inválido."
        }
    }
    const resuladoValidacion = validate({ [id]: valor }, { [id]: restricciones });
    return resuladoValidacion && resuladoValidacion[id];
}

export const validarContrasenia = (id, valor) => {
    const restricciones = {
        presence: { allowEmpty: false, message: "No puede dejar este campo vacío." },

    };
    if (valor !== "") {
        restricciones.length = {
            minimum: 8,
            tooShort: ": al menos necesita ser de 8 caracteres.",
            maximum: 20,
            tooLong: ": no puede exceder %{count} caracteres",
        }
    }
    const resuladoValidacion = validate({ [id]: valor }, { [id]: restricciones });
    return resuladoValidacion && resuladoValidacion[id];
}