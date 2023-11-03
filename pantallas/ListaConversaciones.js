import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import BotonPersonalizadoHeader from '../componentes/BotonPersonalizadoHeader';
import { useSelector } from 'react-redux';
import DatosItem from '../componentes/DatosItem';
import ContenedorPagina from '../componentes/ContenedorPagina';
import TituloPagina from '../componentes/TituloPagina';
import { createSelector } from '@reduxjs/toolkit';
import { desencapsularKyber, encapsularKyber, generarClavesKyber } from '../utils/acciones/criptografia';

const ListaConversaciones = props => {
    //Contiene el id de usuario seleccionado si es que existe, si no: undefined
    const usuarioSeleccionado = props.route?.params?.idUsuarioSeleccionado;
    //Datos del usuario que tiene la sesion abierta
    const datosUsuario = useSelector(state => state.autenticacion.datosUsuario);
    //console.log(datosUsuario);
    const usuariosAlmacenados = useSelector(state => state.usuarios.usuariosAlmacenados);

    const selectConversacionesDelUsuario = createSelector(
        (state) => state.conversaciones.datosConversacion,
        (datosDeConversaciones) => {
            // La función `useMemo()` memoriza el resultado de la función `Object.values()`
            const conversaciones = useMemo(() => Object.values(datosDeConversaciones), [datosDeConversaciones]);
            return conversaciones.sort((a, b) => {
                const dateA = new Date(Date.parse(a.actualizadoEn)).getTime();
                const dateB = new Date(Date.parse(b.actualizadoEn)).getTime();
                return dateB - dateA;
            });
        }
    );

    const conversacionesDelUsuario = useSelector(selectConversacionesDelUsuario);
    //console.log(conversacionesDelUsuario);

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
    }, [props.route?.params], {
        effectResettable: false
    });


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
        <Button
        //TEST KYBER 
            title="Generar claves de Kyber"
            onPress={() => {
                const clavesKyber = generarClavesKyber();
                const ciphertext = encapsularKyber(clavesKyber[0]);
                desencapsularKyber(ciphertext, clavesKyber[1]);
            }}
        />
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

                // Mensaje actualizado para tener el control de quien fue el ultimo en actualizar el chat
                const mensajePropio = datosConversacion.actualizadoPor === datosUsuario.idUsuario;
                const tipoMensaje = mensajePropio ? "mensaje-propio" : "mensaje-otro-usuario";

                return <DatosItem
                    titulo={titulo}
                    imagen={imagen}
                    ultimoMensaje={tipoMensaje}
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