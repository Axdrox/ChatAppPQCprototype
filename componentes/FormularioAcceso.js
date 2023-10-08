import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Locales
import Entrada from '../componentes/Entrada';
import BotonEnviar from '../componentes/BotonEnviar';
import { validarEntrada } from "../utils/acciones/formulario";
import { reducer } from "../utils/reductores/formulario";
import { autorizarAcceso } from "../utils/acciones/autenticacion";
import { ActivityIndicator, Alert } from "react-native";
import { useDispatch } from "react-redux";
import colores from "../constantes/colores";

const FormularioAcceso = props => {

    const initialState = {
        valoresEntrada: {
            correo: "",
            contrasenia: "",
        },
        validacionesEntrada: {
            correo: false,
        },
        formularioValido: false
    }

    const dispatch = useDispatch();

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
            //console.log(formState.valoresEntrada);
            const accion = autorizarAcceso(
                formState.valoresEntrada.correo,
                formState.valoresEntrada.contraseniaInicio
            );
            setError(null);
            await dispatch(accion);
            //Alert.alert("Registro exitoso ✅", "¡Bienvenido!", [{ text: "OK" }]);
        } catch (error) {
            setError(error.message);
            setCargando(false);
        }
    }, [dispatch, formState]);

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

            {
                cargando ?
                    <ActivityIndicator size={'small'} color={colores.blueberry} style={{ marginTop: 10 }} /> :
                    <BotonEnviar
                        title='Ingresar'
                        onPress={controladorAutenticacion}
                        style={{ marginTop: 20 }}
                        disabled={!formState.formularioValido} />
            }
        </>
    )
};

export default FormularioAcceso;