import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import colores from "../constantes/colores";
import estilos from "../constantes/estilos";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from "react-redux";
import { autenticar, setSeIntentoAutoAccesar } from "../store/sliceAutenticacion";
import { obtenerDatosUsuario } from "../utils/acciones/usuario";

const Inicio = () => {

    //Para modificar el estado 
    const dispatch = useDispatch();

    useEffect(() => {
        // Ya que no se puede utilizar async en useEffet se hace un workarround
        const intentarAccesar = async () => {
            const informacionAutenticacionAlmacenada = await ReactNativeAsyncStorage.getItem("datosUsuario");

            //Si no se encontro nada con la clave "datosUsuario" (en este caso)
            if (!informacionAutenticacionAlmacenada) {
                //console.log("No se encontraron datos");
                dispatch(setSeIntentoAutoAccesar());
                return;
            }
            // Obteniendo los datos como un objeto
            const datosProcesados = JSON.parse(informacionAutenticacionAlmacenada);
            const { token, idUsuario, fechaExpiracionToken: fechaExpiracionTokenString } = datosProcesados;

            const fechaExpiracionToken = new Date(fechaExpiracionTokenString);
            // fecha en el pasado o no existe token o no existe usuario
            if (fechaExpiracionToken <= new Date() || !token || !idUsuario) {
                dispatch(setSeIntentoAutoAccesar());
                return;
            }

            //Cuando existe el token al refrescar la aplicacion se mantiene abierto
            const datosUsuario = await obtenerDatosUsuario(idUsuario);
            dispatch(autenticar({ token: token, datosUsuario }));
        };
        intentarAccesar();

    }, [dispatch]);


    return <View style={estilos.centrar}>
        <ActivityIndicator size={'large'} color={colores.blueberry} />
    </View>
}

export default Inicio;