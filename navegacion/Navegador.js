import React from "react";
import { NavigationContainer } from '@react-navigation/native';

import NavegadorPrincipal from "./NavegadorPrincipal";

const Navegador = (props) => {
    return (
    <NavigationContainer>
        <NavegadorPrincipal/>
    </NavigationContainer>
    );
};

export default Navegador;