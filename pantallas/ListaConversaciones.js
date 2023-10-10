import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import BotonPersonalizadoHeader from '../componentes/BotonPersonalizadoHeader';
import { useSelector } from 'react-redux';

const ListaConversaciones = props => {
    //Contiene el id de usuario seleccionado si es que existe, si no: undefined
    const usuarioSeleccionado = props.route?.params?.idUsuarioSeleccionado;
    //Datos del usuario que tiene la sesion abierta
    const datosUsuario = useSelector(state => state.autenticacion.datosUsuario);

    // Todo lo que actualiza los botones de navegacion de header
    // son efectos, por eso se utiliza
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={BotonPersonalizadoHeader}>
                    <Item
                        title="Nueva conversación"
                        iconName='comment-search-outline'
                        //iconSize={20}
                        onPress={() => props.navigation.navigate("NuevaConversacion")}
                        style={{ marginRight: 10 }} />
                </HeaderButtons>
            }
        })
    }, []);

    useEffect(() => {
        if (!usuarioSeleccionado) {
            return;
        }
        //                El idUsuario de seleccionado, nuestro id
        const listaUsuarios = [usuarioSeleccionado, datosUsuario.idUsuario];

        const propsNavegacion = {
            newDatosConversacion: { usuarios: listaUsuarios }
        }

        props.navigation.navigate("Conversacion", propsNavegacion)
    }, [props.route?.params])

    return <View style={styles.container}>
        <Text>Pantalla de Lista de Conversaciones</Text>
        <Button title="Ir a conversación" onPress={() => props.navigation.navigate("Conversacion")} />
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ListaConversaciones;