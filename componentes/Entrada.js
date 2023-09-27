import { StyleSheet, Text, TextInput, View } from "react-native"

import colores from "../constantes/colores";

const Entrada = props => {
    return <View style={styles.contenedor}>

        <Text style={styles.etiqueta}>{props.etiqueta}</Text>

        <View style={styles.contenedorEntrada}>
            {
                props.icono && <props.paqueteIconos
                    name={props.icono}
                    size={props.tamanioIcono || 25}
                    style={styles.icono} />
            }
            <TextInput
                style={styles.entrada} />
        </View>

        {
            //Mostrar mensaje de error en caso de que exista
            props.errorTexto &&
            <View style={styles.errorContenedor}>
                <Text style={styles.errorTexto}>{props.errorTexto}</Text>
            </View>
        }
    </View>
}

const styles = StyleSheet.create({
    contenedor: {
        width: '100%',
        height: 'auto'
    },
    etiqueta: {
        marginVertical: 8,
        fontFamily: 'bold',
        letterSpacing: 0.3,
        color: colores.azulMedianoche
    },
    contenedorEntrada: {
        width: '100%',
        backgroundColor: colores.periwinkle,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icono: {
        marginRight: 10,
        color: colores.azulIndigo
    },
    entrada: {
        flex: 1,
        color: colores.azulMedianoche,
        fontFamily: 'regular',
        letterSpacing: 0.3,
        paddingTop: 0
    },
    errorContenedor: {
        marginVertical: 5
    },
    errorTexto: {
        color: 'red',
        fontSize: 13,
        fontFamily: 'regular',
        letterSpacing: 0.3
    }
});

export default Entrada;