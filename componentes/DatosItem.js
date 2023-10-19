import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import FotoPerfil from "./FotoPerfil";
import colores from "../constantes/colores";
import { MaterialIcons } from '@expo/vector-icons';

const DatosItem = props => {
    // Los datos que se pasan al componente
    const { titulo, imagen, ultimoMensaje } = props;

    // Ya que el usuario selecciona a los usuarios que
    // coinciden con la busqueda y los puede seleccionar
    // Usado en "NuevaConversacion"
    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={styles.contenedor}>

                <FotoPerfil
                    uri={imagen}
                    size={40}
                />

                <View style={styles.contenedorTexto}>
                    <Text
                        style={styles.titulo}
                        numberOfLines={1}>
                        {titulo}
                    </Text>
                </View>
                {
                    //Para mostrar un icono cuando el otro usuario actualice la conversacion
                    ultimoMensaje === "mensaje-otro-usuario" &&
                    <View style={styles.notificacion}>
                        <MaterialIcons name="mark-chat-unread" size={20} color={colores.blueberry} />
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        flexDirection: 'row',
        paddingVertical: 7,
        borderBottomColor: colores.periwinkle,
        borderBottomWidth: 1,
        alignItems: 'center',
        minHeight: 50
    },
    contenedorTexto: {
        marginLeft: 10,
    },
    titulo: {
        fontFamily: 'medium',
        fontSize: 16,
        letterSpacing: 0.3
    },
    notificacion: {
        marginLeft: 'auto',
        paddingRight: 10
    }
});

export default DatosItem;