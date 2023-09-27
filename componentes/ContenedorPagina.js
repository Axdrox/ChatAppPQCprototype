import { StyleSheet, View } from "react-native"

const ContenedorPagina = props => {
    return <View style={{ ...styles.contenedor, ...props.style }}>
        {props.children}
    </View>
}

const styles = StyleSheet.create({
    contenedor: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: 'white'
    }
})

export default ContenedorPagina;