import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Conversacion = props => {
    return <View style={styles.container}>
        <Text>Pantalla de conversación con usuario</Text>
    </View>
};

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Conversacion;