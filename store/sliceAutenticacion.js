import { createSlice } from "@reduxjs/toolkit";
/*Logica de reductor
1. InicialState: el estado en el que se encuentra antes de realizar algo
2. Funciones: utilizadas para actualizar 
*/
const sliceAutenticacion = createSlice({
    name: "autenticacion",
    initialState: {
        token: null,
        datosUsuario: null,
        intentoAutoAccesar: false
    },
    reducers: {
        autenticar: (state, action) => {
            //Payload contiene la informacion que se asigna en acciones->autenticacion
            const { payload } = action;
            state.token = payload.token;
            state.datosUsuario = payload.datosUsuario
            state.intentoAutoAccesar = true;
        },
        setSeIntentoAutoAccesar: (state, action) => {
            state.intentoAutoAccesar = true;
        },
        cerrarSesion: (state, action) => {
            state.token = null;
            state.datosUsuario = null;
            state.intentoAutoAccesar = false;
        },
        modificarDatosUsuario: (state, action) => {
            state.datosUsuario={...state.datosUsuario, ...action.payload.nuevosDatosUsuario}
        }
    }
});

export const autenticar = sliceAutenticacion.actions.autenticar;
export const setSeIntentoAutoAccesar = sliceAutenticacion.actions.setSeIntentoAutoAccesar;
export const cerrarSesion = sliceAutenticacion.actions.cerrarSesion;
export const modificarDatosUsuario = sliceAutenticacion.actions.modificarDatosUsuario;
export default sliceAutenticacion.reducer;