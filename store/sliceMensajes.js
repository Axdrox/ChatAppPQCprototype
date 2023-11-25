import { createSlice } from "@reduxjs/toolkit";
import { descifrarConAES } from "../utils/acciones/criptografia";
/*Logica de reductor
1. InicialState: el estado en el que se encuentra antes de realizar algo
2. Funciones: utilizadas para actualizar 
*/
const sliceMensajes = createSlice({
    name: "mensajes",
    initialState: {
        datosMensajes: {},
    },
    reducers: {
        setMensajesConversacion: (state, action) => {
            const mensajesExistentes = state.datosMensajes;

            // Se recibe un objeto JSON (llaves: idConversacion, datos mensajes; valores: idConversacion, todos los mensajes)
            const { idConversacion, datosMensajes, claveSimetrica } = action.payload;

            mensajesExistentes[idConversacion] = datosMensajes

            //Descifrar mensaje
            let mensajeTextoPlano = "";
            const stringEntradaIV = "P" + idConversacion + "Q" + "C";
            for (const key in datosMensajes) {
                if (claveSimetrica != null) {
                    mensajeTextoPlano = descifrarConAES(datosMensajes[key].mensajeTexto, stringEntradaIV, claveSimetrica);
                    datosMensajes[key].mensajeTexto = mensajeTextoPlano
                }
            }

            state.datosMensajes = mensajesExistentes;
        }
    }
});

export const setMensajesConversacion = sliceMensajes.actions.setMensajesConversacion;
export default sliceMensajes.reducer;