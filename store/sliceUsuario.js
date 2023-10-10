import { createSlice } from "@reduxjs/toolkit";
/*Logica de reductor
1. InicialState: el estado en el que se encuentra antes de realizar algo
2. Funciones: utilizadas para actualizar 
*/
const sliceUsuario = createSlice({
    name: "usuarios",
    initialState: {
        usuariosAlmacenados: {},
    },
    reducers: {
        setUsuariosAlmacenados: (state, action) => {
            const nuevosUsuarios = action.payload.nuevosUsuarios;
            const usuariosExistentes = state.usuariosAlmacenados;

            // Se itera sobre los nuevos usuarios y se actualizan los usuarios existentes
            // key: idUsuario. values: todos los datos del usuario
            const arregloUsuarios = Object.values(nuevosUsuarios);
            for (let i = 0; i < arregloUsuarios.length; i++) {
                const datosUsuario = arregloUsuarios[i];
                usuariosExistentes[datosUsuario.idUsuario] = datosUsuario;
            }
            // Actualizar el estado
            state.usuariosAlmacenados = usuariosExistentes;
        }
    }
});

export const setUsuariosAlmacenados = sliceUsuario.actions.setUsuariosAlmacenados;
export default sliceUsuario.reducer;