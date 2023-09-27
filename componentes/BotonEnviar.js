import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colores from "../constantes/colores";

const BotonEnviar = props => {
    const colorFondoHabilitado = props.color || colores.azulIndigo;
    const colorFondoDeshabilitado = colores.grisClaro;
    const colorFondo = props.disabled ? colorFondoDeshabilitado : colorFondoHabilitado;


    return <TouchableOpacity
        onPress={props.disabled ? () => { } : props.onPress}
        style={{
            ...styles.boton,
            ...props.style,
            ...{ backgroundColor: colorFondo }
        }}>
        <Text style={{ color: 'white' }}>
            {props.title}
        </Text>

    </TouchableOpacity>
};

const styles = StyleSheet.create({
    boton: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'

    }
});

export default BotonEnviar;