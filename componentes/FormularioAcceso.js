import React from "react";
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Locales
import Entrada from '../componentes/Entrada';
import BotonEnviar from '../componentes/BotonEnviar';


const FormularioAcceso = props => {
    return (
        //Regresar multiples elementos
        <>
            

            <Entrada
                etiqueta="Correo"
                icono="mail"
                paqueteIconos={Entypo} />

            <Entrada
                etiqueta="Contraseña"
                icono="lock"
                paqueteIconos={MaterialCommunityIcons} />

            <BotonEnviar
                title='Ingresar'
                onPress={() => console.log("¡Presionado!")}
                style={{ marginTop: 20 }} />
        </>
    )
};

export default FormularioAcceso;