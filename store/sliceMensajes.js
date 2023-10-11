import { createSlice } from "@reduxjs/toolkit";
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

            const { idConversacion, datosMensajes } = action.payload;

            mensajesExistentes[idConversacion] = datosMensajes

            state.datosMensajes = mensajesExistentes;
        }
    }
});

export const setMensajesConversacion = sliceMensajes.actions.setMensajesConversacion;
export default sliceMensajes.reducer;