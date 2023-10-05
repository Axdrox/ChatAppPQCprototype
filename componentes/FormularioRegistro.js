import React, { useCallback, useEffect, useReducer, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Locales
import Entrada from '../componentes/Entrada';
import BotonEnviar from '../componentes/BotonEnviar';
import { validarEntrada } from "../utils/acciones/formulario";
import { reducer } from "../utils/reductores/formulario";
import { registrar } from "../utils/acciones/autenticacion";
import { Alert } from "react-native";

const initialState = {
    valoresEntrada: {
        nombreUsuario: "",
        nombre: "",
        apellido: "",
        correo: "",
        contrasenia: "",
    },
    validacionesEntrada: {
        nombreUsuario: false,
        nombre: false,
        apellido: false,
        correo: false,
        contrasenia: false,
    },
    formularioValido: false
}

const FormularioRegistro = props => {

    /*
    validarConfirmarContrasenia
        <Entrada
            id="confirmarContrasenia"
            etiqueta="Confirmar contraseña"
            icono="lock-check"
            paqueteIconos={MaterialCommunityIcons}
            cambioEntrada={controladorCambiosEntrada} />
    */

    const [error, setError] = useState();
    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const controladorCambiosEntrada = useCallback((idEntrada, valorEntrada) => {
        const resultado = validarEntrada(idEntrada, valorEntrada);
        dispatchFormState({ idEntrada, resultadoValidacion: resultado, valorEntrada })
    }, [dispatchFormState])

    useEffect(()=>{
        if(error){
            Alert.alert("Ocurrió un error", error, [{text:"OK"}]);
        }
        else{
            //Alert.alert("¡Registro exitoso!", error, [{text:"OK"}]);
        }
    }, [error])

    const controladorAutenticacion = async () => {
        try {
            await registrar(
                formState.valoresEntrada.nombreUsuario,
                formState.valoresEntrada.nombre,
                formState.valoresEntrada.apellido,
                formState.valoresEntrada.correo,
                formState.valoresEntrada.contrasenia
            );
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        //Regresar multiples elementos
        <>
            <Entrada
                id="nombreUsuario"
                etiqueta="Nombre de usuario"
                icono="hashtag"
                paqueteIconos={FontAwesome}
                autoCapitalize='none'
                cambioEntrada={controladorCambiosEntrada}
                errorTexto={formState.validacionesEntrada["nombreUsuario"]} />

            <Entrada
                id="nombre"
                etiqueta="Nombre"
                icono="user-circle"
                paqueteIconos={FontAwesome}
                cambioEntrada={controladorCambiosEntrada}
                errorTexto={formState.validacionesEntrada["nombre"]} />

            <Entrada
                id="apellido"
                etiqueta="Apellido"
                icono="user-circle"
                paqueteIconos={FontAwesome}
                cambioEntrada={controladorCambiosEntrada}
                errorTexto={formState.validacionesEntrada["apellido"]} />

            <Entrada
                id="correo"
                etiqueta="Correo"
                icono="mail"
                paqueteIconos={Entypo}
                keyboardType="email-address"
                autoCapitalize='none'
                cambioEntrada={controladorCambiosEntrada}
                errorTexto={formState.validacionesEntrada["correo"]} />

            <Entrada
                id="contrasenia"
                etiqueta="Contraseña"
                icono="lock"
                paqueteIconos={MaterialCommunityIcons}
                autoCapitalize='none'
                secureTextEntry
                cambioEntrada={controladorCambiosEntrada}
                errorTexto={formState.validacionesEntrada["contrasenia"]} />

            <BotonEnviar
                title='Registrar'
                onPress={controladorAutenticacion}
                style={{ marginTop: 20 }}
                disabled={!formState.formularioValido} />

        </>
    )
};

export default FormularioRegistro;