import React, { useCallback, useReducer } from "react";
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Locales
import Entrada from '../componentes/Entrada';
import BotonEnviar from '../componentes/BotonEnviar';
import { validarEntrada } from "../utils/acciones/formulario";
import { reducer } from "../utils/reductores/formulario";

const FormularioAcceso = props => {

    const initialState = {
        valoresEntrada:{
            correo: "",
            contrasenia: "",
        },
        validacionesEntrada: {
            correo: false,
        },
        formularioValido: false
    }

    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const controladorCambiosEntrada = useCallback((idEntrada, valorEntrada) => {
        const resultado = validarEntrada(idEntrada, valorEntrada);
        dispatchFormState({ idEntrada, resultadoValidacion: resultado, valorEntrada })
    }, [dispatchFormState])

    return (
        //Regresar multiples elementos
        <>
            <Entrada
                id="correo"
                etiqueta="Correo"
                icono="mail"
                keyboardType="email-address"
                autoCapitalize='none'
                paqueteIconos={Entypo}
                cambioEntrada={controladorCambiosEntrada}
                errorTexto={formState.validacionesEntrada["correo"]} />

            <Entrada
                id="contraseniaInicio"
                etiqueta="Contraseña"
                icono="lock"
                autoCapitalize='none'
                secureTextEntry
                paqueteIconos={MaterialCommunityIcons}
                cambioEntrada={controladorCambiosEntrada} />

            <BotonEnviar
                title='Ingresar'
                onPress={() => console.log("¡Presionado!")}
                style={{ marginTop: 20 }}
                disabled={!formState.formularioValido} />
        </>
    )
};

export default FormularioAcceso;