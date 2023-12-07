import React, { useEffect, useState } from "react";
//import { createStackNavigator } from '@react-navigation/stack'; //StackAPI
import { createNativeStackNavigator } from '@react-navigation/native-stack'; //Stack-NATIVE-API
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import Ionicons from '@expo/vector-icons/Ionicons'
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import app from "../utils/firebaseHelper";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

//Locales
import ListaConversaciones from '../pantallas/ListaConversaciones';
import Conversacion from '../pantallas/Conversacion';
import ConfiguracionPerfil from '../pantallas/ConfiguracionPerfil';
import NuevaConversacion from "../pantallas/NuevaConversacion";
import { setDatosConversacion } from "../store/sliceConversacion";
import { ActivityIndicator, View } from "react-native";
import colores from "../constantes/colores";
import estilos from "../constantes/estilos";
import { setUsuariosAlmacenados } from "../store/sliceUsuario";
import { setMensajesConversacion } from "../store/sliceMensajes";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";


const obtenerValor = async (prefix, key) => {
    try {
        const valor = await ReactNativeAsyncStorage.getItem(prefix + key);
        return valor;
    } catch (e) {
        console.log("Error al obtener datos: " + e);
    }
    console.log('Se obtuvieron los datos correctamente.')
}

//React Navigator
//const Stack = createStackNavigator();//StackAPI
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Navegador de pestañas inferiores
const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{
            headerTitle: '',
            headerShadowVisible: false
        }}>
            <Tab.Screen name="ListaConversaciones" component={ListaConversaciones} options={{
                tabBarLabel: 'Conversaciones',
                tabBarIcon: ({ color, size }) => (
                    <Entypo name="chat" size={size} color={color} />
                )
            }} />
            <Tab.Screen name="ConfiguracionPerfil" component={ConfiguracionPerfil} options={{
                tabBarLabel: 'Configurar Perfil',
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 name="user-cog" size={size} color={color} />
                )
            }} />
        </Tab.Navigator>
    );
};

const NavegadorStack = () => {
    return (
        <Stack.Navigator>
            {/* Stack.Group: Para organizar las pantallas de una forma más efectiva
                las Stack.Screen que están dentro de Stack.Group comparten compartir 
                las opciones */}
            <Stack.Group>
                <Stack.Screen name="Home" component={TabNavigator} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Conversacion" component={Conversacion} options={{
                    headerTitle: ""
                }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'containedModal' }}>
                <Stack.Screen name="NuevaConversacion" component={NuevaConversacion} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

const NavegadorPrincipal = props => {
    // Para despachar sliceConversacion
    const dispatch = useDispatch();

    // Ya que cuando cargue este componente tiene que estar activo en lo que termina de mostrar la informacion
    const [cargando, setCargando] = useState(true);

    const datosUsuario = useSelector(state => state.autenticacion.datosUsuario);
    const usuariosAlmacenados = useSelector(state => state.usuarios.usuariosAlmacenados);

    //Obteniendo los chats de usuario en Firebase
    useEffect(() => {
        console.log("Suscribiendo listeners en Firebase");
        const referenciaBaseDatos = ref(getDatabase(app));
        const referenciaUsuarios = child(referenciaBaseDatos, `conversacionesUsuario/${datosUsuario.idUsuario}`);
        // Para controlar todos los listeners que se tengan
        const referencias = [referenciaUsuarios];

        // Es un listener: cuando se realicen cambios se va a detectar y ejecutar esta funcion
        onValue(referenciaUsuarios, (snapshotQuery) => {
            const idDatosConversacion = snapshotQuery.val() || {};
            //Para obtener unicamente los valores y no todas las claves, el resultado es un array
            const idConversaciones = Object.values(idDatosConversacion);
            //console.log(idConversaciones);

            // Logica para obtener todos los datos de la conversacion del usuario
            const datosConversacion = {};
            let contadorDeConversacionesEncontradas = 0;
            for (let i = 0; i < idConversaciones.length; i++) {
                const idConversacion = idConversaciones[i];
                const referenciaConversacion = child(referenciaBaseDatos, `conversaciones/${idConversacion}`);
                referencias.push(referenciaConversacion);

                // Si es que existen conversaciones de ese usuario
                onValue(referenciaConversacion, (snapshotConversacion) => {
                    contadorDeConversacionesEncontradas++;

                    const datos = snapshotConversacion.val();
                    if (datos) {
                        // id de conversacion en Firebase
                        datos.key = snapshotConversacion.key;

                        datos.usuarios.forEach(idUsuario => {
                            if (usuariosAlmacenados[idUsuario]) { return; }
                            // Se obtiene la referencia de usuario para poder obtener su informacion
                            const refUsuario = child(referenciaBaseDatos, `usuarios/${idUsuario}`);

                            // No escucha cuando se hacen cambios, por lo que se ejecuta una vez, a diferencia de onValue
                            get(refUsuario).then(snapshotUsuario => {
                                const snapshotDatosUsuario = snapshotUsuario.val();
                                dispatch(setUsuariosAlmacenados({ nuevosUsuarios: { snapshotDatosUsuario } }));
                            });

                            referencias.push(refUsuario);
                        })

                        datosConversacion[snapshotConversacion.key] = datos;
                    }

                    if (contadorDeConversacionesEncontradas >= idConversaciones.length) {
                        dispatch(setDatosConversacion({ datosConversacion }));
                        // Una vez que termina de mostrarlos, se desactiva el loading spinner
                        setCargando(false);
                    }
                });

                // Obtener los mensajes de la base de datos
                const referenciaMensajes = child(referenciaBaseDatos, `mensajes/${idConversacion}`);
                referencias.push(referenciaMensajes);

                onValue(referenciaMensajes, async snapshotMensajes => {
                    const datosMensajes = snapshotMensajes.val();

                    //Ver los datos de los mensajes recibidos de Firebase Realtime database
                    //console.log(JSON.stringify(datosMensajes, undefined, 4));
                    
                    const claveSimetrica = await obtenerValor("smk", idConversacion);
                    dispatch(setMensajesConversacion({ idConversacion, datosMensajes, claveSimetrica }));           
                })

                if (contadorDeConversacionesEncontradas == 0) {
                    //No se muestra el loading spinner
                    setCargando(false);
                }
            }
        })
        // Se ejecuta cuando la funcion useEffect va a terminar, de manera que se cierran los listeners
        // se puede probar cerrando sesion
        return () => {
            console.log("Cerrando listeners de Firebase");
            referencias.forEach(ref => off(ref));
        }
    }, []);


    if (cargando) {
        <View style={estilos.centrar}>
            <ActivityIndicator size={'large'} color={colores.blueberry} />
        </View>
    }


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <NavegadorStack />
        </KeyboardAvoidingView>
    );
};

export default NavegadorPrincipal;