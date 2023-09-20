import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConfiguracionPerfil = props => {
    return <View style={styles.container}>
        <Text>Pantalla de configuracion de perfil de usuario</Text>
    </View>
};

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ConfiguracionPerfil;