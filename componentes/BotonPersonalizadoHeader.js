import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colores from '../constantes/colores'

const BotonPersonalizadoHeader = props => {
    return <HeaderButton
        {...props}
        IconComponent={MaterialCommunityIcons}
        iconSize={23}
        color={props.color ?? colores.blueberry} />

};

export default BotonPersonalizadoHeader