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
    const mensajesConversacion = useSelector(state => {
        if (!idConversacion) return [];
        const datosDelMensajeDeConversacion = state.mensajes.datosMensajes[idConversacion];

        if (!datosDelMensajeDeConversacion) return [];

        const listaMensajes = [];

        // key: Para ubicarla en la base de datos: mensajes->idConversacion->"key"->datos
        for (const key in datosDelMensajeDeConversacion) {
            const mensaje = datosDelMensajeDeConversacion[key];
            mensaje.key = key;
            //Se llena el arreglo de mensajes que corresponden a la conversacion de los usuaios
            listaMensajes.push(mensaje);
        }
        return listaMensajes;
    });

    //    console.log(mensajesConversacion);

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
            await enviarMensajeTexto(id, datosUsuario.idUsuario, mensajeTexto);

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
                    //Para desactivar el boton de enviar si no se ha escrito nada
                    mensajeTexto === "" &&
                    <TouchableOpacity disabled={true}
                        style={styles.botonEnviar}>
                        <MaterialCommunityIcons name="send-circle-outline" size={35} color={colores.periwinkle} />
                    </TouchableOpacity>
                }

                {
                    //Para activar el boton de enviar si se escribe algo
                    mensajeTexto !== "" &&
                    <TouchableOpacity disabled={false}
                        style={styles.botonEnviar}
                        onPress={enviarMensaje}>
                        <MaterialCommunityIcons name="send-circle-outline" size={35} color={colores.blueberry} />
                    </TouchableOpacity>
                }

            </View>
        </SafeAreaView>
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