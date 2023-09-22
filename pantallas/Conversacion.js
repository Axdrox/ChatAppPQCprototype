import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Button, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import imagenFondoPantalla from '../assets/imagenes/abstractWallpaper_00.jpg'
import colores from '../constantes/colores';


const Conversacion = props => {
    const [mensajeTexto, setMensajeTexto] = useState("");
    //console.log(mensajeTexto)

    // Para que no renderice el mensaje aunque cambie el estado
    const enviarMensaje = useCallback(() => {
        setMensajeTexto("");
    }, [mensajeTexto]);

    return (
        <SafeAreaView
            edges={['right', 'left', 'bottom']}
            style={styles.container}>
            <ImageBackground source={imagenFondoPantalla} style={styles.imagenFondoPantalla}>

            </ImageBackground>
            <View style={styles.contenedorEntrada}>

                <TextInput
                    style={styles.cajaTexto}
                    value={mensajeTexto}
                    onChangeText={text => setMensajeTexto(text)}
                    onSubmitEditing={enviarMensaje} />

                {
                    mensajeTexto === "" &&
                    <TouchableOpacity disabled={true}
                        style={styles.botonEnviar}>
                        <MaterialCommunityIcons name="send-circle-outline" size={35} color={colores.grisClaro} />
                    </TouchableOpacity>
                }

                {
                    mensajeTexto !== "" &&
                    <TouchableOpacity disabled={false}
                        style={styles.botonEnviar}
                        onPress={enviarMensaje}>
                        <MaterialCommunityIcons name="send-circle-outline" size={35} color={colores.azul} />
                    </TouchableOpacity>
                }

            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    imagenFondoPantalla: {
        flex: 1
    },
    contenedorEntrada: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 50
    },
    cajaTexto: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colores.grisClaro,
        marginLeft: 10,
        marginHorizontal: 6,
        paddingHorizontal: 15
    },
    botonEnviar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40
    }
})

export default Conversacion;