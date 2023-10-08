import React from "react";
import { NavigationContainer } from '@react-navigation/native';

import NavegadorPrincipal from "./NavegadorPrincipal";
import Acceso from "../pantallas/Acceso";
import { useSelector } from "react-redux";
import Inicio from "../pantallas/Inicio";

const Navegador = (props) => {
    // Para ir a la pantalla de chats una vez que se haya registrado
    const estaAutenticado = useSelector(state => state.autenticacion.token !== null && state.autenticacion.token != "");

    const intentoAutoAccesar = useSelector(state => state.autenticacion.intentoAutoAccesar);

    return (
        <NavigationContainer>
            {estaAutenticado && <NavegadorPrincipal />}

            {!estaAutenticado && intentoAutoAccesar && <Acceso />}

            {
                // Si no ha accesado a la aplicacion y no se ha intentado accesar
                !estaAutenticado && !intentoAutoAccesar && <Inicio />
            }
        </NavigationContainer>
    );
};

export default Navegador;