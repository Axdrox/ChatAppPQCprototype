import React from "react";
import { NavigationContainer } from '@react-navigation/native';

import NavegadorPrincipal from "./NavegadorPrincipal";
import Acceso from "../pantallas/Acceso";

const Navegador = (props) => {
    const estaAutenticado = false;

    return (
    <NavigationContainer>
        {estaAutenticado && <NavegadorPrincipal/>}
        {!estaAutenticado && <Acceso/>}
    </NavigationContainer>
    );
};

export default Navegador;