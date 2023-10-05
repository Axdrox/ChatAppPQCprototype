import app from '../firebaseHelper';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export const registrar = async (usuario, nombre, apellido, correo, contrasenia) => {
    //Instancia de autenticacion de la aplicacion en Firebase
    const autenticacion = getAuth(app);

    try {
        const result = await createUserWithEmailAndPassword(autenticacion, correo, contrasenia);
    } catch (error) {
        console.log(error.code)
        const codigoError = error.code;

        let mensaje = "Algo salió mal.";

        if (codigoError === "auth/email-already-in-use") {
            mensaje = "Este correo ya ha sido registrado."
        }
        throw new Error(mensaje);
    }
}