import {configureStore} from "@reduxjs/toolkit";
import sliceAutenticacion from "./sliceAutenticacion";

//Hay que pensar que es el estado de la aplicacion
export const store = configureStore({
    //slices de estado: son reductores de logica en el mismo archivo
    reducer: {
        autenticacion: sliceAutenticacion
    }
});