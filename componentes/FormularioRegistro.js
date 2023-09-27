import React from "react";
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Locales
import Entrada from '../componentes/Entrada';
import BotonEnviar from '../componentes/BotonEnviar';

const FormularioRegistro = props => {
    return (
        //Regresar multiples elementos
        <>
            <Entrada
                etiqueta="Nombre de usuario"
                icono="hashtag"
                paqueteIconos={FontAwesome} />

            <Entrada
                etiqueta="Nombre"
                icono="user-circle"
                paqueteIconos={FontAwesome} />

            <Entrada
                etiqueta="Apellido"
                icono="user-circle"
                paqueteIconos={FontAwesome} />

            <Entrada
                etiqueta="Correo"
                icono="mail"
                paqueteIconos={Entypo} />

            <Entrada
                etiqueta="Contraseña"
                icono="lock"
                paqueteIconos={MaterialCommunityIcons} />

            <Entrada
                etiqueta="Confirmar contraseña"
                icono="lock-check"
                paqueteIconos={MaterialCommunityIcons} />

            <BotonEnviar
                title='Registrar'
                onPress={() => console.log("¡Presionado!")}
                style={{ marginTop: 20 }} />
        </>
    )
};

export default FormularioRegistro;