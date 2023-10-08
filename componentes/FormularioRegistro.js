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
import { ActivityIndicator, Alert } from "react-native";
import colores from "../constantes/colores";
import { useDispatch, useSelector } from "react-redux";

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

    // Permite que se pueda utilizar una funcion que se puede
    // utilizar en cualquier punto para actualizar el estado
    // NOTA: unicamente se puede actualizar el estado despachando acciones
    const dispatch = useDispatch();
    
    // Para accesar al estado EJEMPLO
    //const stateData = useSelector(state => state.autenticacion);
    //console.log(stateData);

    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const controladorCambiosEntrada = useCallback((idEntrada, valorEntrada) => {
        const resultado = validarEntrada(idEntrada, valorEntrada);
        dispatchFormState({ idEntrada, resultadoValidacion: resultado, valorEntrada })
    }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert("Ocurrió un error", error, [{ text: "OK" }]);
        }
    }, [error]);

    const controladorAutenticacion = useCallback(async () => {
        try {
            setCargando(true);
            const accion = registrar(
                formState.valoresEntrada.nombreUsuario,
                formState.valoresEntrada.nombre,
                formState.valoresEntrada.apellido,
                formState.valoresEntrada.correo,
                formState.valoresEntrada.contrasenia
            );
            setError(null);
            await dispatch(accion);
            Alert.alert("Registro exitoso ✅", "¡Bienvenido!", [{ text: "OK" }]);
        } catch (error) {
            setError(error.message);
            setCargando(false);
        }
    }, [dispatch, formState]);

    return (
        //Regresar multiples elementoshttps://console.firebase.google.com/u/6/project/chat-app-pqc-prototype/authentication/users?hl=es-419
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

            {
                cargando ?
                    <ActivityIndicator size={'small'} color={colores.blueberry} style={{ marginTop: 10 }} /> :
                    <BotonEnviar
                        title='Registrar'
                        onPress={controladorAutenticacion}
                        style={{ marginTop: 20 }}
                        disabled={!formState.formularioValido} />
            }
        </>
    )
};

export default FormularioRegistro;