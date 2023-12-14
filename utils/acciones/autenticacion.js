import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import app from '../firebaseHelper';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { child, get, getDatabase, ref, set, update } from 'firebase/database'
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
                dispatch(terminarSesion(datosUsuario));
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

            //console.log("Identificador de usuario: " + uid + "\nToken de acceso: " + accessToken);

            const fechaExpiracionToken = new Date(expirationTime);
            const tiempoActual = new Date();
            const milisegundosHastaExpiracion = fechaExpiracionToken - tiempoActual;

            const datosUsuario = await obtenerDatosUsuario(uid);
            //console.log(JSON.stringify(datosUsuario, undefined, 4));

            // Actualizando el estado
            dispatch(autenticar({ token: accessToken, datosUsuario }));
            // Guardar datos a asyncStorage
            guardarDatos(accessToken, uid, fechaExpiracionToken);
            // Token de notificacion push
            await almacenarTokenNotificacionesPush(datosUsuario);

            //Para cerrar la sesion
            //NOTA: se puede reemplazar la variable "milisegundosHastaExpiracion" 
            //por 3000 para que se cierre la sesion en 3 segundos
            temporizador = setTimeout(() => {
                dispatch(terminarSesion(datosUsuario));
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

export const terminarSesion = (datosUsuario) => {
    return async dispatch => {
        try {
            //console.log(datosUsuario);
            await eliminarTokenNotificacionesPush(datosUsuario);
        } catch (error) {
            console.log(error);
        }
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

// Función para registrar el token de los usuarios 
// para recibir notificaciones push
const almacenarTokenNotificacionesPush = async (datosUsuario) => {
    // Si no es un dispositivo real (emulador)
    if (!Device.isDevice)
        return;

    // Obteniendo token
    const token = (await Notifications.getExpoPushTokenAsync({ projectId: 'c6f1b38a-0eee-424d-924e-7c846bf3b37b' })).data;
    // Si el usuario tiene pushTokens utilizarlos, si no es un objeto vacío
    const datosToken = { ...datosUsuario.pushTokens } || {};
    const arregloToken = Object.values(datosToken);

    if (arregloToken.includes(token))
        return;

    arregloToken.push(token);

    // Convertir el arreglo en llave-valor
    for (let i = 0; i < arregloToken.length; i++) {
        const tkn = arregloToken[i];
        datosToken[i] = tkn;
    }

    // Enviarlo a la base de datos
    const referenciaBaseDatos = ref(getDatabase(app));
    // Definiendo la ruta en donde se almacenan los token en la base
    const referenciaUsuario = child(referenciaBaseDatos, `usuarios/${datosUsuario.idUsuario}/tokenNotificacionPush`);
    // Registrando los tokens
    await set(referenciaUsuario, datosToken);
}

// Función para eliminar el token de los usuarios 
// para evitar que un usuario diferente que inicie sesion
// utilice el token del usuario anterior
const eliminarTokenNotificacionesPush = async (datosUsuario) => {
    // Si no es un dispositivo real (emulador)
    if (!Device.isDevice)
        return;

    // Obteniendo token
    const token = (await Notifications.getExpoPushTokenAsync({ projectId: 'c6f1b38a-0eee-424d-924e-7c846bf3b37b' })).data;
    // Si el usuario tiene pushTokens utilizarlos, si no es un objeto vacío
    const datosToken = await obtenerTokensPushUsuarios(datosUsuario.idUsuario);

    for (const key in datosToken) {
        if (datosToken[key] === token) {
            delete datosToken[key];
            break;
        }
    }

    // Enviarlo a la base de datos
    const referenciaBaseDatos = ref(getDatabase(app));
    // Definiendo la ruta en donde se almacenan los token en la base
    const referenciaUsuario = child(referenciaBaseDatos, `usuarios/${datosUsuario.idUsuario}/tokenNotificacionPush`);
    // Registrando los tokens
    await set(referenciaUsuario, datosToken);
}

export const obtenerTokensPushUsuarios = async (idUsuario) => {
    try {
        const referenciaBaseDatos = ref(getDatabase(app));
        const referenciaUsuario = child(referenciaBaseDatos, `usuarios/${idUsuario}/tokenNotificacionPush`);

        const snapshot = await get(referenciaUsuario);
        if (!snapshot || !snapshot.exists()) {
            return {};
        }

        return snapshot.val() || {};

    } catch (error) {
        console.log(error);
    }
}