import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Locales
import fotoDefault from '../assets/imagenes/avatarProfilePicture_alt.png';
import colores from '../constantes/colores';
import { lanzarSelectorImagen, subirImagenFirebase } from "../utils/imagenHelper";

const FotoPerfil = props => {

    // Si se pasa una uri se utiliza, en otro caso, se deja la imagen por default
    const fuente = props.uri ? { uri: props.uri } : fotoDefault;

    const [imagen, setImagen] = useState(fuente);

    const elegirImagen = async () => {
        try {
            const uriTemporal = await lanzarSelectorImagen();

            if (!uriTemporal) return;

            // Cargar/Subir imagen en Firebase
            const subirUrl = await subirImagenFirebase(uriTemporal);

            if (!subirUrl) {
                throw new Error("No fue posible almacenar la imagen en servidor");
            }

            // Visualizarla en el dispositivo
            setImagen({ uri: subirUrl });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <TouchableOpacity onPress={elegirImagen}>
            <Image
                style={{ ...styles.image, ...{ height: props.size, width: props.size } }}
                source={imagen}
            />
            <View style={styles.editarIcono}>
                <MaterialCommunityIcons name="pencil-circle" size={24} color={colores.blueberry} />
            </View>
        </TouchableOpacity>
    )
};

export default FotoPerfil;

const styles = StyleSheet.create({
    image: {
        borderRadius: 50,
        borderColor: colores.periwinkle,
        borderWidth: 1,
    },
    editarIcono: {
        position: 'absolute',
        bottom: -8,
        right: -5,
        //backgroundColor: colores.periwinkle,
        borderRadius: 20,
        padding: 8,
    }
});