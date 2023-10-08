import { child, get, getDatabase, ref } from "firebase/database"
import app from "../firebaseHelper";

export const obtenerDatosUsuario = async (idUsuario) => {
    try {
        const referenciaBaseDatos = ref(getDatabase(app));
        const referenciaUsuario = child(referenciaBaseDatos, `usuarios/${idUsuario}`);
        //Snapshot: Obtener datos de Firebase
        const snapshot = await get(referenciaUsuario);
        return snapshot.val()
    } catch (error) {
        console.log(error);
    }
}