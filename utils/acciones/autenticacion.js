import app from '../firebaseHelper';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { child, getDatabase, ref, set, update } from 'firebase/database'
import { autenticar, cerrarSesion } from '../../store/sliceAutenticacion';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerDatosUsuario } from './usuario';

let temporizador;

//Funcion para registrar al usuario y que inicie sesion al registrarse
// Funcion que una vez que se llame retorna una accion
export const registrar = (nombreUsuario, nombre, apellido, correo, contrasenia) => {
    return async dispatch => {
        //Instancia de autenticacion de la aplicacion en Firebase
        const autenticacion = getAuth(app);

        try {
            const resultado = await createUserWithEmailAndPassword(autenticacion, correo, contrasenia);
            //Obteniendo el id de usuario de autenticacion, una vez que se ha creado
            const { uid, stsTokenManager } = resultado.user;
            const { accessToken, expirationTime } = stsTokenManager;

            const fechaExpiracionToken = new Date(expirationTime);
            const tiempoActual = new Date();
            const milisegundosHastaExpiracion = fechaExpiracionToken - tiempoActual;

            const datosUsuario = await crearUsuario(nombreUsuario, nombre, apellido, /*correo,*/ uid);
            //console.log(datosUsuario);

            // Actualizando el estado
            dispatch(autenticar({ token: accessToken, datosUsuario }));
            // Guardar datos a asyncStorage
            guardarDatos(accessToken, uid, fechaExpiracionToken);

            //Para cerrar la sesion
            //NOTA: se puede reemplazar la variable "milisegundosHastaExpiracion" 
            //por 3000 para que se cierre la sesion en 3 segundos
            temporizador = setTimeout(() => {
                dispatch(terminarSesion());
            }, milisegundosHastaExpiracion);

        } catch (error) {
            //console.log(error)
            const codigoError = error.code;
            //console.log(codigoError);
            let mensaje = "Algo salió mal.";

            if (codigoError === "auth/email-already-in-use") {
                mensaje = "Este correo ya ha sido registrado."
            }
            throw new Error(mensaje);
        }
    }

}

// Funcion que una vez que se llame retorna una accion
export const autorizarAcceso = (correo, contrasenia) => {
    return async dispatch => {
        //Instancia de autenticacion de la aplicacion en Firebase
        const autenticacion = getAuth(app);

        try {
            const resultado = await signInWithEmailAndPassword(autenticacion, correo, contrasenia);
            //Obteniendo el id de usuario de autenticacion, una vez que se ha creado
            const { uid, stsTokenManager } = resultado.user;
            const { accessToken, expirationTime } = stsTokenManager;

            const fechaExpiracionToken = new Date(expirationTime);
            const tiempoActual = new Date();
            const milisegundosHastaExpiracion = fechaExpiracionToken - tiempoActual;

            const datosUsuario = await obtenerDatosUsuario(uid);
            //console.log(datosUsuario);

            // Actualizando el estado
            dispatch(autenticar({ token: accessToken, datosUsuario }));
            // Guardar datos a asyncStorage
            guardarDatos(accessToken, uid, fechaExpiracionToken);

            //Para cerrar la sesion
            //NOTA: se puede reemplazar la variable "milisegundosHastaExpiracion" 
            //por 3000 para que se cierre la sesion en 3 segundos
            temporizador = setTimeout(() => {
                dispatch(terminarSesion());
            }, milisegundosHastaExpiracion);

        } catch (error) {
            const codigoError = error.code;
            //console.log(codigoError);

            let mensaje = "Algo salió mal.";

            if (codigoError === "auth/invalid-login-credentials" || codigoError === "auth/user-not-found" || codigoError === "auth/invalid-password") {
                mensaje = "El correo o contraseña ingresados son incorrectos."
            }
            if (codigoError === "auth/too-many-requests") {
                mensaje = "Intentos agotados, probar más tarde.⌛"
            }
            throw new Error(mensaje);
        }
    }

}

export const terminarSesion = () => {
    return async dispatch => {
        ReactNativeAsyncStorage.removeItem("datosUsuario");
        clearTimeout(temporizador);
        dispatch(cerrarSesion());
    }
}

const crearUsuario = async (nombreUsuario, nombre, apellido, /*correo, */ idUsuario) => {
    const datosUsuario = {
        nombreUsuario,
        nombre,
        apellido,
        //correo,
        idUsuario,
        fechaRegistro: new Date().toISOString()
    };

    // Da la referencia a la base de datos de la aplicacion en Firebase
    const referenciaBaseDatos = ref(getDatabase(app));
    const referenciaHijo = child(referenciaBaseDatos, `usuarios/${idUsuario}`);
    await set(referenciaHijo, datosUsuario);
    return datosUsuario;
}

const guardarDatos = (token, idUsuario, fechaExpiracionToken) => {
    ReactNativeAsyncStorage.setItem("datosUsuario", JSON.stringify({
        token,
        idUsuario,
        fechaExpiracionToken: fechaExpiracionToken.toISOString()
    }));
}

export const actualizarDatosUsuario = async (idUsuario, nuevosDatos) => {
    // Da la referencia a la base de datos de la aplicacion en Firebase
    const referenciaBaseDatos = ref(getDatabase(app));
    const referenciaHijo = child(referenciaBaseDatos, `usuarios/${idUsuario}`);
    await update(referenciaHijo, nuevosDatos);
}