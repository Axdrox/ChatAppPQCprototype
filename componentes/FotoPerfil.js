import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Locales
import fotoDefault from '../assets/imagenes/avatarProfilePicture_alt.png';
import colores from '../constantes/colores';
import { lanzarSelectorImagen, subirImagenFirebase } from "../utils/imagenHelper";
import { actualizarDatosUsuario } from "../utils/acciones/autenticacion";
import { useDispatch } from "react-redux";
import { modificarDatosUsuario } from "../store/sliceAutenticacion";

const FotoPerfil = props => {
    const dispatch = useDispatch();

    // Si se pasa una uri se utiliza, en otro caso, se deja la imagen por default
    const fuente = props.uri ? { uri: props.uri } : fotoDefault;

    const [imagen, setImagen] = useState(fuente);

    // Para mostrar el loadingSpinner en lo que carga la imagen
    const [estaCargando, setEstaCargando] = useState(false);

    // Pasarlo al formulario: se pasa desde configuracion de perfil
    const idUsuario = props.idUsuario;

    // Para poder ocultar las propiedades (boton editar y elegir imagen) al buscar los usuarios
    const mostrarBotonEditar = props.mostrarBotonEditar && props.mostrarBotonEditar === true;

    const elegirImagen = async () => {
        try {
            const uriTemporal = await lanzarSelectorImagen();

            if (!uriTemporal) return;

            // Cargar/Subir imagen en Firebase
            setEstaCargando(true);
            const subirUrl = await subirImagenFirebase(uriTemporal);
            setEstaCargando(false);

            if (!subirUrl) {
                throw new Error("No fue posible almacenar la imagen en servidor");
            }

            const nuevosDatosUsuario = { fotoPerfil: subirUrl };

            // De acciones->autenticacion: actualiza el atributo "fotoPerfil" del usuario en la realtime database en Firebase
            await actualizarDatosUsuario(idUsuario, nuevosDatosUsuario);
            // De store -> sliceAutenticacion: Se actualizan las variables de estado
            dispatch(modificarDatosUsuario({ nuevosDatosUsuario }));

            // Visualizarla en el dispositivo
            setImagen({ uri: subirUrl });
        } catch (error) {
            console.log(error);
            setEstaCargando(false);
        }
    }

    // Para controlar el tipo de elemento que es dependiendo si se esta buscando un usuario
    // o cuando se esta configurando el perfil, ya que, unicamente se debe poder editar la foto
    // cuando se modifica el perfil y no en los resultados de la busqueda
    // NOTA: los componentes necesitan estar en mayuscula siempre en React
    const Contenedor = mostrarBotonEditar ? TouchableOpacity : View;

    return (
        <Contenedor onPress={elegirImagen}>
            {
                // Mientras este cargando, muestra que esta cargando, de otra forma muestra la imagen
                estaCargando ?
                    <View height={props.size} width={props.size} style={styles.contenedorEstaCargando}>
                        <ActivityIndicator size={'small'} color={colores.blueberry} />
                    </View> :
                    <Image
                        style={{ ...styles.image, ...{ height: props.size, width: props.size } }}
                        source={imagen}
                    />
            }

            {
                !estaCargando && mostrarBotonEditar &&
                <View style={styles.editarIcono}>
                    <MaterialCommunityIcons name="pencil-circle" size={24} color={colores.blueberry} />
                </View>
            }


        </Contenedor>
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
    },
    contenedorEstaCargando: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});