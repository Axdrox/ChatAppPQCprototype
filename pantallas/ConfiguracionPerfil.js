import React, { useCallback, useReducer, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';


//Locales
import { reducer } from "../utils/reductores/formulario";
import Entrada from '../componentes/Entrada';
import TituloPagina from '../componentes/TituloPagina';
import ContenedorPagina from '../componentes/ContenedorPagina';
import { validarEntrada } from "../utils/acciones/formulario";
import { useDispatch, useSelector } from 'react-redux';
import BotonEnviar from '../componentes/BotonEnviar';
import colores from '../constantes/colores';
import { actualizarDatosUsuario, terminarSesion } from '../utils/acciones/autenticacion';
import { modificarDatosUsuario } from '../store/sliceAutenticacion';
import FotoPerfil from '../componentes/FotoPerfil';

const ConfiguracionPerfil = props => {

    const dispatch = useDispatch();

    //Para obtener los datos del usuario y cargarlos en la pantalla (Se accede a store)
    //Se utiliza en initialValue
    const datosUsuario = useSelector(state => state.autenticacion.datosUsuario);
    //console.log(datosUsuario);


    //Para detectar cambios y poder ocultar el boton "Guardar"
    const nombreUsuario = datosUsuario.nombreUsuario || "";
    const nombre = datosUsuario.nombre || "";
    const apellido = datosUsuario.apellido || "";
    //const correo = datosUsuario.correo || "";

    const initialState = {
        valoresEntrada: {
            nombreUsuario,
            nombre,
            apellido,
            //correo,
        },
        validacionesEntrada: {
            nombreUsuario: undefined,
            nombre: undefined,
            apellido: undefined,
            //correo: undefined,
        },
        formularioValido: false
    }

    const [cargando, setCargando] = useState(false);

    const [mensajeExito, setMensajeExito] = useState(false);

    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const controladorCambiosEntrada = useCallback((idEntrada, valorEntrada) => {
        const resultado = validarEntrada(idEntrada, valorEntrada);
        dispatchFormState({ idEntrada, resultadoValidacion: resultado, valorEntrada })
    }, [dispatchFormState]);

    const controladorActualizacion = useCallback(async () => {
        const valoresActualizados = formState.valoresEntrada;

        try {
            setCargando(true);
            await actualizarDatosUsuario(datosUsuario.idUsuario, valoresActualizados);
            dispatch(modificarDatosUsuario({ nuevosDatosUsuario: valoresActualizados }));

            setMensajeExito(true);
            setTimeout(() => {
                setMensajeExito(false);
            }, 3000);
        } catch (error) {
            console.log(error);
        }
        finally {
            setCargando(false);
        }
    }, [dispatch, formState]);

    const existenCambios = () => {
        const valoresActuales = formState.valoresEntrada;
        return valoresActuales.nombreUsuario != nombreUsuario ||
            valoresActuales.nombre != nombre ||
            valoresActuales.apellido != apellido;
        // ||valoresActuales.correo != correo;
    }

    return <ContenedorPagina style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
                style={styles.mostrarCorrectamenteTecladoiOS}
                behavior={Platform.OS === "ios" ? "height" : undefined}
                keyboardVerticalOffset={100}>

                <View style={{ alignItems: 'center' }}>
                    <TituloPagina texto="Configuración de perfil" />
                    <FotoPerfil
                        size={100}
                        idUsuario={datosUsuario.idUsuario}
                        //Se carga la foto de Firebase
                        uri={datosUsuario.fotoPerfil}
                        mostrarBotonEditar={true}
                    />
                </View>

                <Entrada
                    id="nombreUsuario"
                    etiqueta="Nombre de usuario"
                    icono="hashtag"
                    paqueteIconos={FontAwesome}
                    autoCapitalize='none'
                    cambioEntrada={controladorCambiosEntrada}
                    errorTexto={formState.validacionesEntrada["nombreUsuario"]}
                    initialValue={datosUsuario.nombreUsuario} />

                <Entrada
                    id="nombre"
                    etiqueta="Nombre"
                    icono="user-circle"
                    paqueteIconos={FontAwesome}
                    cambioEntrada={controladorCambiosEntrada}
                    errorTexto={formState.validacionesEntrada["nombre"]}
                    initialValue={datosUsuario.nombre} />

                <Entrada
                    id="apellido"
                    etiqueta="Apellido"
                    icono="user-circle"
                    paqueteIconos={FontAwesome}
                    cambioEntrada={controladorCambiosEntrada}
                    errorTexto={formState.validacionesEntrada["apellido"]}
                    initialValue={datosUsuario.apellido} />
                {/* 
                    <Entrada
                        id="correo"
                        etiqueta="Correo"
                        icono="mail"
                        paqueteIconos={Entypo}
                        keyboardType="email-address"
                        autoCapitalize='none'
                        cambioEntrada={controladorCambiosEntrada}
                        errorTexto={formState.validacionesEntrada["correo"]}
                        initialValue={datosUsuario.correo} />

                         */}

                <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>

                    {
                        mensajeExito && <Text style={{ color: colores.verde, fontFamily: 'semiBold', letterSpacing: 0.3 }}>¡Datos guardados!</Text>
                    }

                    {
                        cargando ?
                            <ActivityIndicator size={'small'} color={colores.blueberry} style={{ marginTop: 10 }} /> :
                            existenCambios() && <BotonEnviar
                                title='Guardar'
                                onPress={controladorActualizacion}
                                style={{ marginTop: 10, width: "40%" }}
                                disabled={!formState.formularioValido} />
                    }

                    <BotonEnviar
                        title='Cerrar sesión'
                        onPress={() => dispatch(terminarSesion(datosUsuario))}
                        style={{ marginTop: 25 }}
                        color={colores.rojoMorado} />

                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    </ContenedorPagina >
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center'
    }
})

export default ConfiguracionPerfil;