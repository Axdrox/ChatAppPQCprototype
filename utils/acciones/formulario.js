import { validarCadena, validarContrasenia, validarCorreo, validarNombreUsuario } from "../restriccionesValidacion";

export const validarEntrada = (idEntrada, valorEntrada) => {
    if (idEntrada === "nombreUsuario") {
        return validarNombreUsuario(idEntrada, valorEntrada);
    }
    else if (idEntrada === "nombre" || idEntrada === "apellido") {
        return validarCadena(idEntrada, valorEntrada)
    }
    else if (idEntrada === "correo") {
        return validarCorreo(idEntrada, valorEntrada)
    }
    else if (idEntrada === "contrasenia") {
        return validarContrasenia(idEntrada, valorEntrada)
    }
}