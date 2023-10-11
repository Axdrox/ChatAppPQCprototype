import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colores from "../constantes/colores";

const Burbuja = props => {
    const { texto, tipo } = props;

    const estiloBurbuja = { ...styles.contenedor };
    const estiloTexto = { ...styles.texto };
    const estiloEnvoltura = { ...styles.estiloDeEnvoltura };

    switch (tipo) {
        case "sistema":
            estiloTexto.color = 'white';
            estiloBurbuja.backgroundColor = colores.blueberry;
            estiloBurbuja.borderColor = colores.azulMedianoche;
            estiloBurbuja.alignItems = 'center';
            estiloBurbuja.marginTop = 10;
            break;
        case "sistema-error":
            estiloTexto.color = "white";
            estiloBurbuja.backgroundColor = colores.rojoMorado;
            estiloBurbuja.borderColor = 'red';
            estiloBurbuja.alignItems = 'center';
            estiloBurbuja.borderRadius = 5;
            estiloBurbuja.padding = 4;
            estiloBurbuja.marginTop = 10;
            break;
        case "mensaje-propio":
            estiloEnvoltura.justifyContent = 'flex-end';
            estiloBurbuja.maxWidth = '70%';
            estiloBurbuja.borderRadius = 15;
            estiloBurbuja.padding = 4;
            break;
        case "mensaje-otro-usuario":
            estiloEnvoltura.justifyContent = 'flex-start';
            estiloBurbuja.backgroundColor = colores.azulOtroUsuario;
            estiloBurbuja.maxWidth = '70%';
            estiloBurbuja.borderRadius = 15;
            estiloBurbuja.padding = 4;
            break;

        default:
            break;
    }

    return (
        <View style={estiloEnvoltura}>
            <View style={estiloBurbuja}>
                <Text style={estiloTexto}>
                    {texto}
                </Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    estiloDeEnvoltura: {
        flexDirection: 'row',
        justifyContent: 'center',
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
        borderWidth: 1,
        alignItems: 'center'
    }
});

export default Burbuja;