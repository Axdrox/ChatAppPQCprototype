import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import FotoPerfil from "./FotoPerfil";
import colores from "../constantes/colores";

const DatosItem = props => {
    // Los datos que se pasan al componente
    const { titulo, imagen } = props;

    // Ya que el usuario selecciona a los usuarios que
    // coinciden con la busqueda y los puede seleccionar
    // Usado en "NuevaConversacion"
    return (
        <TouchableWithoutFeedback>
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
        marginLeft:10,
    },
    titulo: {
        fontFamily: 'medium',
        fontSize: 16,
        letterSpacing: 0.3
    }
});

export default DatosItem;