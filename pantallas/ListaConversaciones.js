import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ListaConversaciones = props => {
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