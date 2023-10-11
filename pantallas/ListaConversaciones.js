import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import BotonPersonalizadoHeader from '../componentes/BotonPersonalizadoHeader';
import { useSelector } from 'react-redux';
import DatosItem from '../componentes/DatosItem';
import ContenedorPagina from '../componentes/ContenedorPagina';
import TituloPagina from '../componentes/TituloPagina';
import { createSelector } from '@reduxjs/toolkit';

const ListaConversaciones = props => {
    //Contiene el id de usuario seleccionado si es que existe, si no: undefined
    const usuarioSeleccionado = props.route?.params?.idUsuarioSeleccionado;
    //Datos del usuario que tiene la sesion abierta
    const datosUsuario = useSelector(state => state.autenticacion.datosUsuario);
    const usuariosAlmacenados = useSelector(state => state.usuarios.usuariosAlmacenados);

    //Para mostrar las conversaciones encontradas (ubicado en: NavegadorPrincipal y ese llama sliceConversacion)
    // recordar que tiene que coincidir con el key que se asigno en store (state=>state.conversaciones) y en el sliceConversacion
    // utilizar el mismo nombre del objeto de initialState (datosConversacion, en este caso)
    // De esta forma ya se agregaron al estado y se pueden utilizar
    // NOTA: SE PODRIA OPTIMIZAR ESTA PARTE, POR EL MOMENTO SE DEJARA ASI Y OMITIRA LA ADVERTENCIA EN "App.js -> LogBox.ignoreLogs" CHECAR https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
    const conversacionesDelUsuario = useSelector(state => {
        const datosDeConversaciones = state.conversaciones.datosConversacion;
        // Los muestra y ordena de acuerdo con la ultima actualzacion de la conversacion
        return Object.values(datosDeConversaciones).sort((a, b) => {
            return new Date(b.actualizadoEn) - new Date(a.actualizadoEn);
        })
    })

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
    }, [props.route?.params]);

    return <ContenedorPagina>
        <TituloPagina texto="Conversaciones" />
        <FlatList
            data={conversacionesDelUsuario}
            renderItem={(itemData) => {
                const datosConversacion = itemData.item;

                const idConversacion = datosConversacion.key;

                //Para obtener los id de los usuarios de la conversacion que no sea el usuario actual
                //Se revisa el array "usuarios" que esta en el nodo conversacion 
                const idOtroUsuario = datosConversacion.usuarios.find(uid => uid !== datosUsuario.idUsuario)
                const otroUsuario = usuariosAlmacenados[idOtroUsuario];
                if (!otroUsuario) return;

                //Para desplegar la informacion del usuario
                const titulo = `${otroUsuario.nombre} ${otroUsuario.apellido}`;
                const imagen = otroUsuario.fotoPerfil;

                return <DatosItem
                    titulo={titulo}
                    imagen={imagen}
                    onPress={() => props.navigation.navigate("Conversacion", { idConversacion })}
                />
            }}
        />
    </ContenedorPagina>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ListaConversaciones;