import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import BotonPersonalizadoHeader from '../componentes/BotonPersonalizadoHeader';

const ListaConversaciones = props => {

    // Todo lo que actualiza los botones de navegacion de header
    // son efectos, por eso se utiliza
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={BotonPersonalizadoHeader}>
                    <Item
                        title="Nueva conversación"
                        iconName='comment-search-outline'
                        onPress={() => props.navigation.navigate("NuevaConversacion")}
                        style={{ marginRight: 20 }} />
                </HeaderButtons>
            }
        })
    }, [])

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