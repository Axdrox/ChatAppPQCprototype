import { StyleSheet, Text, View } from "react-native"
import colores from "../constantes/colores"

export default TituoEncabezado = props => {
    return <View style={styles.contenedor}>
        <Text style={styles.texto}>{props.texto}</Text>
    </View>
}

const styles = StyleSheet.create({
    contenedor: {
        marginBottom: 10,

    },
    texto: {
        fontSize: 28,
        color: colores.azulIndigo,
        fontFamily: 'bold',
        letterSpacing: 0.3
    }
})