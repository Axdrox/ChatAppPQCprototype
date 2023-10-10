import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colores from "../constantes/colores";

const Burbuja = props => {
    const { texto, tipo } = props;

    const estiloBurbuja = { ...styles.contenedor };
    const estiloTexto = { ...styles.texto };

    switch (tipo) {
        case "sistema":
            estiloTexto.color = colores.azulMedianoche;
            estiloBurbuja.backgroundColor = colores.periwinkle;
            estiloBurbuja.alignItems = 'center';
            estiloBurbuja.marginTop = 10;
            break;

        default:
            break;
    }

    return (
        <View style={styles.estiloDeWrapper}>
            <View style={estiloBurbuja}>
                <Text style={estiloTexto}>
                    {texto}
                </Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    estiloDeWrapper: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    texto: {
        fontFamily: 'regular',
        letterSpacing: 0.3
    },
    contenedor: {
        backgroundColor: colores.periwinkle,
        borderRadius: 10,
        padding: 2,
        marginBottom: 10,
        borderColor: colores.blueberry,
        borderWidth: 1
    }
});

export default Burbuja;