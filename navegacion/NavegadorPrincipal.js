import React from "react";
//import { createStackNavigator } from '@react-navigation/stack'; //StackAPI
import { createNativeStackNavigator } from '@react-navigation/native-stack'; //Stack-NATIVE-API
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import Ionicons from '@expo/vector-icons/Ionicons'
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

//Locales
import ListaConversaciones from '../pantallas/ListaConversaciones';
import Conversacion from '../pantallas/Conversacion';
import ConfiguracionPerfil from '../pantallas/ConfiguracionPerfil';
import NuevaConversacion from "../pantallas/NuevaConversacion";

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

const NavegadorPrincipal = props => {
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

            <Stack.Group screenOptions={{presentation: 'containedModal'}}>
                <Stack.Screen name="NuevaConversacion" component={NuevaConversacion} />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default NavegadorPrincipal;