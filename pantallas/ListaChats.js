import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListaChats = props => {
    return <View style={styles.container}>
        <Text>Pantalla de Lista de Chats</Text>
    </View>
};

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ListaChats;