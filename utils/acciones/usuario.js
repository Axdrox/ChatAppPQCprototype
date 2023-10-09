import { child, endAt, get, getDatabase, orderByChild, query, ref, startAt } from "firebase/database"
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

export const buscarUsuarios = async (textoQuery) => {
    const terminoBusqueda = textoQuery.toLowerCase().trim();
    try {
        const referenciaBaseDatos = ref(getDatabase(app));
        const referenciaUsuario = child(referenciaBaseDatos, 'usuarios');
        //                                               Restricciones para poder realizar busqueda en Firebase
        const referenciaQuery = query(referenciaUsuario, orderByChild('nombreUsuario'), startAt(terminoBusqueda), endAt(terminoBusqueda + "\uf8ff"));

        //Ejecutando Query
        const snapshot = await get(referenciaQuery);

        if (snapshot.exists()) {
            return snapshot.val();
        }

        return {};
    } catch (error) {
        console.log(error);
        throw error;
    }

}