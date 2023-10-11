import { createSlice } from "@reduxjs/toolkit";
/*Logica de reductor
1. InicialState: el estado en el que se encuentra antes de realizar algo
2. Funciones: utilizadas para actualizar 
*/
const sliceConversacion = createSlice({
    name: "conversaciones",
    initialState: {
        datosConversacion: {},
    },
    reducers: {
        setDatosConversacion: (state, action) => {
            state.datosConversacion = action.payload.datosConversacion;
        }
    }
});

export const setDatosConversacion = sliceConversacion.actions.setDatosConversacion;
export default sliceConversacion.reducer;