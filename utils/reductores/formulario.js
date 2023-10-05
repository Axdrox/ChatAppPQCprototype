export const reducer = (state, action) => {
    const { resultadoValidacion, idEntrada, valorEntrada } = action;

    /*
        Obtiene las validaciones actuales y actualiza 
        el campo que esta siendo modificado con su id
    */
    const validacionesActualizadas = {
        ...state.validacionesEntrada,
        [idEntrada]: resultadoValidacion
    };

    const valoresActualizados = {
        ...state.valoresEntrada,
        [idEntrada]: valorEntrada
    };

    let formularioActualizadoValido = true;

    /*
        Verifica que todos los elementos del formulario sean validos 
        y en caso de no serlo, actualiza el formulario para que no 
        sea valido
    */
    for(const key in validacionesActualizadas) {
        if(validacionesActualizadas[key] !== undefined){
            formularioActualizadoValido = false;
            break;
        }
    }

    return{
        valoresEntrada: valoresActualizados,
        validacionesEntrada: validacionesActualizadas, 
        formularioValido: formularioActualizadoValido
    }
}