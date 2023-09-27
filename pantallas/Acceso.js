import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//locales
import ContenedorPagina from '../componentes/ContenedorPagina';
import FormularioRegistro from '../componentes/FormularioRegistro';
import FormularioAcceso from '../componentes/FormularioAcceso';
import colores from '../constantes/colores';
import logo from '../assets/imagenes/logo.png'

const Acceso = props => {
    // Variable de estado para cambiar entre formulario de registro y de acceso
    const [estaRegistrado, cambiarFormulario] = useState(false);

    return <SafeAreaView style={{ flex: 1 }}>
        <ContenedorPagina>
            <ScrollView showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView
                    style={styles.mostrarCorrectamenteTecladoiOS}
                    behavior={Platform.OS === "ios" ? "height" : undefined}
                    keyboardVerticalOffset={100}>

                    <View style={styles.contenedorImagen}>
                        <Image
                            style={styles.imagen}
                            source={logo}
                        />
                    </View>

                    {
                        estaRegistrado ?
                            <FormularioRegistro /> :
                            <FormularioAcceso />
                    }

                    <TouchableOpacity
                        //Cambia la variable de estado
                        onPress={() => cambiarFormulario(prevState => !prevState)}
                        style={styles.contenedorEnlace}>

                        <Text style={styles.enlace}>{`${estaRegistrado ? "¿Ya tienes cuenta? Ingresa" : "¿No tienes cuenta? Regístrate"}`}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </ContenedorPagina>
    </SafeAreaView>
};

const styles = StyleSheet.create({
    contenedorEnlace: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15
    },
    enlace: {
        color: colores.azul,
        fontFamily: 'medium',
        letterSpacing: 0.3
    },
    mostrarCorrectamenteTecladoiOS: {
        flex: 1,
        justifyContent: 'center'
    },
    contenedorImagen: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%',
        //backgroundColor: 'red'
    },
    imagen: {
        width: '45%',
        resizeMode:'contain',
    }
});

export default Acceso;