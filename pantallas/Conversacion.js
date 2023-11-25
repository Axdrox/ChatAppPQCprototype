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

    // Se reciben los mensajes descifrados de SliceMensajes, entonces se procesa para presentarlos
    const selectMensajesConversacion = createSelector(
        state => state.mensajes.datosMensajes[idConversacion],
        (datosDelMensajeDeConversacion) => {
            const listaMensajes = [];
            for (const key in datosDelMensajeDeConversacion) {
                //console.log(datosDelMensajeDeConversacion[key].mensajeTexto);
                const mensaje = datosDelMensajeDeConversacion[key];
                mensaje.key = key;
                listaMensajes.push(mensaje);
            }
            return listaMensajes;
        }
    );

    const mensajesConversacion = useSelector(selectMensajesConversacion);

    // Para que el primer mensaje que se envíe sea una invitación a conversar
    if (mensajesConversacion.length === 0 && mensajeTexto === "") {
        setMensajeTexto("Invitación para conversar");
    }

    // Para saber quién fue el usuario que envió el primer mensaje
    const idUsuarioPrimerMensaje = (mensajesConversacion.length !== 0) ? mensajesConversacion[0].enviadoPor : "";

    let mensajesEnviadosPrimerUsuario = 0;
    mensajesConversacion.forEach((id) => {
        if (idUsuarioPrimerMensaje === id.enviadoPor)
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
                // Si no existe un id de conversacion (la conversacion es nueva)
                // se crea la conversacion a partir del primer mensaje enviado
                // NOTA: SE PUBLICA LA CLAVE PUBLICA DE KYBER DE QUIEN CREA LA CONVERSACION
                id = await crearConversacion(datosUsuario.idUsuario, props.route.params.newDatosConversacion);
                setIdConversacion(id);
            }
            //Invitacion para conversar
            if (mensajesConversacion.length === 0) {
                await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto, false, false, true);
            }
            //Para ejecutar el algoritmo de encapsulado (Usuario que no crea la conversacion/que no envia el primer mensaje)
            else if (mensajesConversacion.length === 1 && datosUsuario.idUsuario !== idUsuarioPrimerMensaje) {
                await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto, true, false, false);
            }
            //Para que siga cifrando el usuario que ya encapsulo y genero su clave simetrica
            else if (mensajesConversacion.length > 1 && datosUsuario.idUsuario !== idUsuarioPrimerMensaje) {
                await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto, false, false, false);
            }
            //Para ejecutar el algoritmo de desencapsulacion (Usuario que genera las claves de Kyber/inicia la conversación)
            else if (mensajesEnviadosPrimerUsuario === 1 && datosUsuario.idUsuario === idUsuarioPrimerMensaje) {
                await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto, false, true, false);
            }
            //Para que siga cifrando el usuario que ya desencapsulo y genero su clave simetrica
            else if (mensajesEnviadosPrimerUsuario > 1 && datosUsuario.idUsuario === idUsuarioPrimerMensaje) {
                await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto, false, false, false);
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
                        <Burbuja texto="Este usuaro quiere conversar, envía un mensaje de vuelta para conversar." tipo="sistema" />
                    }

                    {
                        (mensajesConversacion.length === 1 && datosUsuario.idUsuario === idUsuarioPrimerMensaje) &&
                        <Burbuja texto="Espera la constestación del otro usuario." tipo="sistema" />
                    }

                    {
                        (mensajesEnviadosPrimerUsuario === 1 && mensajesConversacion.length >= 2 && datosUsuario.idUsuario === idUsuarioPrimerMensaje) &&
                        <Burbuja texto="Envía otro mensaje para descifrar los mensajes." tipo="sistema" />
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

                {
                    (mensajesConversacion.length === 0) ?
                        <TextInput
                            style={{ ...styles.cajaTexto, color: 'black' }}
                            value={mensajeTexto}
                            onSubmitEditing={enviarMensaje}
                            editable={false} /> :
                        <TextInput
                            style={styles.cajaTexto}
                            value={mensajeTexto}
                            onChangeText={text => setMensajeTexto(text)}
                            onSubmitEditing={enviarMensaje}
                            placeholder='Mensaje...' />
                }

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