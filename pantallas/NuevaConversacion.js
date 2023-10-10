import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import BotonPersonalizadoHeader from '../componentes/BotonPersonalizadoHeader';
import ContenedorPagina from '../componentes/ContenedorPagina';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colores from '../constantes/colores';
import estilos from '../constantes/estilos';
import { buscarUsuarios } from '../utils/acciones/usuario';
import DatosItem from '../componentes/DatosItem';
import { useDispatch, useSelector } from 'react-redux';
import { setUsuariosAlmacenados } from '../store/sliceUsuario';

const NuevaConversacion = props => {
    //Para poder modificar el estado
    const dispatch = useDispatch();

    //Varialbes de estado para mostrar cuando no se ha encontrado nada o no se ha realizado busqueda
    const [cargando, setCargando] = useState(false);
    const [usuarios, setUsuarios] = useState();
    const [sinResultados, setSinResultados] = useState(false);
    // Para actualizar conforme el usuario escriba
    const [terminoDeBusqueda, setTerminoDeBusqueda] = useState('');

    // Datos del usuario actual
    const datosUsuario = useSelector(state => state.autenticacion.datosUsuario);

    // Todo lo que actualiza los botones de navegacion de header
    // son efectos, por eso se utiliza
    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return <HeaderButtons HeaderButtonComponent={BotonPersonalizadoHeader}>
                    <Item
                        //title="Cerrar"
                        iconName='arrow-left'
                        onPress={() => props.navigation.goBack()} />
                </HeaderButtons>
            },
            headerTitle: "Nueva conversación",
        })
    }, []);

    // Se ejecuta cuando se interactua con la caja de busqueda
    // de acuerdo con un tiempo establecido
    // se efectua la busqueda unos breves momentos despues de que el
    // usuario deja de escribir
    useEffect(() => {
        const retrasarBusqueda = setTimeout(async () => {
            if (!terminoDeBusqueda || terminoDeBusqueda === "") {
                setUsuarios();
                setSinResultados(false);
                return;
            }
            setCargando(true);

            /*prueba
            setUsuarios({});
            setSinResultados(true);
            */

            // Acciones->Usuario: Ejecutar consulta en Firebase
            const resultadosDeUsuario = await buscarUsuarios(terminoDeBusqueda);

            // Para que no muestre nuestro usuario al realizar busqueda
            delete resultadosDeUsuario[datosUsuario.idUsuario];

            setUsuarios(resultadosDeUsuario);

            if (Object.keys(resultadosDeUsuario).length === 0) {
                setSinResultados(true);
            }
            else {
                setSinResultados(false);
                dispatch(setUsuariosAlmacenados({nuevosUsuarios: resultadosDeUsuario}))
            }

            setCargando(false);
        }, 500);

        // Para no crear un timer cada ocasion que se realiza una busqueda
        return () => clearTimeout(retrasarBusqueda);
    }, [terminoDeBusqueda]);

    const usuarioSeleccionado = idUsuario => {
        props.navigation.navigate("ListaConversaciones", {
            idUsuarioSeleccionado: idUsuario
        })
    }

    return <ContenedorPagina>

        <View style={styles.contenedorBusqueda}>
            <EvilIcons name="search" size={20} color={colores.blueberry} />
            <TextInput
                placeholder='Buscar...'
                style={styles.cajaBusqueda}
                onChangeText={(texto) => setTerminoDeBusqueda(texto)}
            />
        </View>

        {
            // Muestra el icono de carga
            cargando &&
            <View style={estilos.centrar}>
                <ActivityIndicator size={'large'} color={colores.periwinkle} />
            </View>
        }

        {
            // Si se encuentran usuarios
            !cargando && !sinResultados && usuarios &&
            // FlatList: Es parecido a un scrollview pero se utiliza
            // cuando no se sabe cuantos resultados se obtendran
            <FlatList
                data={Object.keys(usuarios)}
                renderItem={(itemData) => {
                    const idUsuario = itemData.item;
                    const datosUsuario = usuarios[idUsuario];
                    return <DatosItem
                        titulo={`${datosUsuario.nombre} ${datosUsuario.apellido}`}
                        imagen={datosUsuario.fotoPerfil}
                        onPress={() => usuarioSeleccionado(idUsuario)}
                    />
                }}
            />
        }


        {
            !cargando && sinResultados && (
                <View style={estilos.centrar}>
                    <MaterialCommunityIcons
                        name="account-question"
                        size={70}
                        color={colores.periwinkle}
                        style={styles.iconoSinResultados}
                    />
                    <Text style={styles.textoSinResultados}>No se encontró usuario</Text>
                </View>
            )
        }


        {
            !cargando && !usuarios && (
                <View style={estilos.centrar}>
                    <MaterialCommunityIcons
                        name="account-search"
                        size={70}
                        color={colores.periwinkle}
                        style={styles.iconoSinResultados}
                    />
                    <Text style={styles.textoSinResultados}>Escribe el nombre de usuario para realizar búsqueda</Text>
                </View>
            )
        }
    </ContenedorPagina>
};

const styles = StyleSheet.create({
    contenedorBusqueda: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colores.periwinkle,
        height: 30,
        marginVertical: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 20
    },
    cajaBusqueda: {
        marginLeft: 10,
        fontSize: 15,
        width: "100%"
    },
    iconoSinResultados: {
        //marginBottom: 20
    },
    textoSinResultados: {
        color: colores.blueberry,
        fontFamily: 'regular',
        //letterSpacing: 0.3
    }

})

export default NuevaConversacion;