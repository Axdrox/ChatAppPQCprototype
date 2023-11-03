import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Button, TextInput, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

// Locales
import imagenFondoPantalla from '../assets/imagenes/abstractWallpaper_00.jpg';
import colores from '../constantes/colores';
import ContenedorPagina from "../componentes/ContenedorPagina";
import Burbuja from '../componentes/Burbuja';
import { crearConversacion, enviarMensajeTexto } from '../utils/acciones/accionesConversacion';
import { createSelector } from '@reduxjs/toolkit';

const Conversacion = props => {
    //Variables de estado
    const [conversacionUsuarios, setConversacionUsuarios] = useState([]);
    const [mensajeTexto, setMensajeTexto] = useState("");
    const [idConversacion, setIdConversacion] = useState(props.route?.params?.idConversacion);
    //Para mostrar un error en caso de que exista
    const [bannerDeError, setBannerDeError] = useState("");

    const datosUsuario = useSelector(state => state.autenticacion.datosUsuario);
    const usuariosAlmacenados = useSelector(state => state.usuarios.usuariosAlmacenados);
    const conversacionesAlmacenadas = useSelector(state => state.conversaciones.datosConversacion);

    // PODRIA OCUPARSE CRIPTOGRAFIA PARA DESCIFRAR MENSAJES
    const selectMensajesConversacion = createSelector(
        state => state.mensajes.datosMensajes[idConversacion],
        (datosDelMensajeDeConversacion) => {
            const listaMensajes = [];

            for (const key in datosDelMensajeDeConversacion) {
                const mensaje = datosDelMensajeDeConversacion[key];
                mensaje.key = key;
                console.log(mensaje);
                listaMensajes.push(mensaje);
            }
            return listaMensajes;
        }
    );

    const mensajesConversacion = useSelector(selectMensajesConversacion);

    const idUsuarioPrimerMensaje = (mensajesConversacion.length !== 0) ? mensajesConversacion[0].enviadoPor : "";

    let mensajesEnviadosPrimerUsuario = 0;
    mensajesConversacion.forEach((id) => {
        if(idUsuarioPrimerMensaje === id.enviadoPor)
            mensajesEnviadosPrimerUsuario += 1;
    });

    

    // Si existe un idConversacion, almacena los datos de la conversacion en conversacionesAlmacenadas respecto a ese idConversacion, si no, que sean nuevos datos de conversacion
    const datosConversacion = (idConversacion && conversacionesAlmacenadas[idConversacion]) || props.route?.params?.newDatosConversacion;
    //console.log(datosConversacion);

    const obtenerTituloDeNombre = () => {
        //                              que encuentre los idUsuario que no coincida con el nuestro
        const idDeOtrosUsuarios = conversacionUsuarios.find(uid => uid !== datosUsuario.idUsuario);
        const datosDeOtrosUsuarios = usuariosAlmacenados[idDeOtrosUsuarios];

        return datosDeOtrosUsuarios && `${datosDeOtrosUsuarios.nombre} ${datosDeOtrosUsuarios.apellido}`;
    }

    useEffect(() => {

        props.navigation.setOptions({
            headerTitle: obtenerTituloDeNombre(),
        })

        setConversacionUsuarios(datosConversacion.usuarios)
    }, [conversacionUsuarios]);

    // Para que no renderice el mensaje aunque cambie el estado
    const enviarMensaje = useCallback(async () => {
        // Interaccion con Firebase
        try {
            let id = idConversacion;
            if (!id) {
                // Si no existe un id de conversacion (es nueva la conversacion)
                // crear conversacion a partir del primer mensaje enviado
                // NOTA: AQUI SE PUEDE UTILIZAR CRIPTOGRAFIA PARA LA PARTE DE SUBIR LA CLAVE PUBLICA DE KYBER
                id = await crearConversacion(datosUsuario.idUsuario, props.route.params.newDatosConversacion);
                setIdConversacion(id);
            }

            //Logica para crear el mensaje y mandarlo a la base de datos en Firebase
            //NOTA: AQUI SE PUEDE UTILIZAR CRIPTOGRAFIA PARA CIFRAR EL MENSAJE
            //await enviarMensajeTexto(idConversacion, datosUsuario.idUsuario, mensajeTexto);

            //Para seguir la logica de generar el establecimiento de clave utilizando encapsulacion con la contestacion del usuario que no envio el primer mensaje
            if (mensajesConversacion.length === 1 && datosUsuario.idUsuario !== idUsuarioPrimerMensaje) {
                await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto, true, false);
            }
            //Para el usuario que genera las claves de Kyber y pueda desencapsular la clave compartida
            else if (mensajesEnviadosPrimerUsuario === 1 && datosUsuario.idUsuario === idUsuarioPrimerMensaje) {
                await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto, false, true);
            }
            //Usuario que genera el encapsulado
            else {
                console.log("geloooo");
                await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto, false, false);
            }
            setMensajeTexto("");
        } catch (error) {
            console.log(error);
            setBannerDeError("Error al enviar mensaje (⁠-⁠︵⁠-⁠,⁠)");
            setTimeout(() => setBannerDeError(""), 3000);
        }


    }, [mensajeTexto, idConversacion]);

    return (
        <SafeAreaView
            edges={['right', 'left', 'bottom']}
            style={styles.container}>
            <ImageBackground source={imagenFondoPantalla} style={styles.imagenFondoPantalla}>

                <ContenedorPagina style={{ backgroundColor: 'transparent' }}>
                    {
                        !idConversacion && <Burbuja texto="¡Nueva conversación! ^⁠⁠‿⁠^)/" tipo="sistema" />
                    }

                    {
                        bannerDeError !== "" && <Burbuja texto={bannerDeError} tipo="sistema-error" />
                    }

                    {
                        (mensajesConversacion.length === 1 && datosUsuario.idUsuario !== idUsuarioPrimerMensaje) &&
                        <Burbuja texto="Este usuaro quiere conversar, envía un mensaje de vuelta para cifrar la conversación." tipo="sistema" />
                    }

                    {
                        (mensajesConversacion.length === 1 && datosUsuario.idUsuario === idUsuarioPrimerMensaje) &&
                        <Burbuja texto="Espera la constestación del otro usuario para cifrar la conversación." tipo="sistema" />
                    }

                    {
                        // AQUI SE PODRIA UTILIZAR CRIPTO PARA DESCIFRAR LOS MENSAJES
                        idConversacion &&
                        <FlatList
                            data={mensajesConversacion}
                            renderItem={(itemData) => {
                                //Contiene todo los datos de cada mensaje
                                const mensaje = itemData.item;

                                // Mensaje enviado por el usuario actual
                                const mensajePropio = mensaje.enviadoPor === datosUsuario.idUsuario;

                                const tipoMensaje = mensajePropio ? "mensaje-propio" : "mensaje-otro-usuario";
                                //console.log("tipo Mensaje: " + tipoMensaje);
                                return <Burbuja
                                    tipo={tipoMensaje}
                                    texto={mensaje.mensajeTexto}
                                />
                            }}
                        />
                    }
                </ContenedorPagina>

            </ImageBackground>
            <View style={styles.contenedorEntrada}>

                <TextInput
                    style={styles.cajaTexto}
                    value={mensajeTexto}
                    onChangeText={text => setMensajeTexto(text)}
                    onSubmitEditing={enviarMensaje} />

                {
                    //Para desactivar el boton de enviar si no se ha escrito nada y el usuario que envia el primer mensaje 
                    (mensajeTexto === "" || (mensajesConversacion.length === 1 && datosUsuario.idUsuario === idUsuarioPrimerMensaje)) &&
                    < TouchableOpacity disabled={true}
                        style={styles.botonEnviar}>
                        <MaterialCommunityIcons name="send-circle-outline" size={35} color={colores.periwinkle} />
                    </TouchableOpacity>
                }

                {
                    //Para activar el boton de enviar si se escribe algo
                    (mensajeTexto !== "" && (mensajesConversacion.length != 1 || (mensajesConversacion.length === 1 && datosUsuario.idUsuario !== idUsuarioPrimerMensaje))) &&
                    <TouchableOpacity disabled={false}
                        style={styles.botonEnviar}
                        onPress={enviarMensaje}>
                        <MaterialCommunityIcons name="send-circle-outline" size={35} color={colores.blueberry} />
                    </TouchableOpacity>
                }

            </View>
        </SafeAreaView >
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    imagenFondoPantalla: {
        flex: 1
    },
    contenedorEntrada: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 50
    },
    cajaTexto: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colores.grisClaro,
        marginLeft: 10,
        marginHorizontal: 6,
        paddingHorizontal: 15
    },
    botonEnviar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40
    }
})

export default Conversacion;