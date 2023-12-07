import { child, get, getDatabase, push, ref, set, update } from "firebase/database";
import { app } from '../firebaseHelper';
import { cifrarConAES, desencapsularKyber, encapsularKyber, generarClaveSimetrica, generarClavesKyber } from "./criptografia";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const almacenarValor = async (prefix, key, value) => {
    try {
        await ReactNativeAsyncStorage.setItem(prefix + key, value);
    } catch (e) {
        console.log("Error al almacenar datos: " + e);
    }
    console.log('Se almacenaron los datos correctamente.')
};

const obtenerValor = async (prefix, key) => {
    try {
        const valor = await ReactNativeAsyncStorage.getItem(prefix + key);
        return valor;
    } catch (e) {
        console.log("Error al obtener datos: " + e);
    }
    console.log('Se obtuvieron los datos correctamente.')
}

const removerValor = async (prefix, key) => {
    try {
        await ReactNativeAsyncStorage.removeItem(prefix + key)
    } catch (e) {
        console.log("Error al remover datos: " + e);
    }
    console.log('Se removieron los datos correctamente.');
}

// AQUI SE PUEDE UTILIZAR CRIPTOGRAFIA PARA LA PARTE DE SUBIR LA CLAVE PUBLICA DE KYBER
export const crearConversacion = async (idUsuarioQueInicioSesion, datosConversacion) => {
    const newDatosConversacion = {
        ...datosConversacion,
        //SE PODRIAN QUITAR
        //creadoPor: idUsuarioQueInicioSesion,
        actualizadoPor: idUsuarioQueInicioSesion,
        //creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString()
    };

    //guardar las claves de acuerdo con el id de la conversacion
    const referenciaBaseDatos = ref(getDatabase(app));
    //En donde se va a realizar la creacion de la conversacion en la base de datos de Firebase, el nodo es 'conversaciones'
    const nuevaConversacion = await push(child(referenciaBaseDatos, 'conversaciones'), newDatosConversacion);

    //Llamando el algoritmo de generacion de claves de Kyber
    const clavesKyber = generarClavesKyber();
    //Guardando clave secreta de Kyber
    almacenarValor("sk", nuevaConversacion.key, clavesKyber[1]);
    const datosClavePublicaKyber = {
        creadoPor: idUsuarioQueInicioSesion,
        KyberClavePublica: clavesKyber[0],
        KyberTextoCifrado: ""
    }
    // Se utiliza set para no crear un nodo extra, en caso contrario de push
    await set(child(referenciaBaseDatos, `clavePublica/${nuevaConversacion.key}`), datosClavePublicaKyber);

    const usuariosDeLaConversacion = newDatosConversacion.usuarios;
    for (let i = 0; i < usuariosDeLaConversacion.length; i++) {
        const idUsuario = usuariosDeLaConversacion[i];
        //push: Genera una nueva ubicacion secundaria usando una CLAVE UNICA y devuelve su referencia
        //en este caso la ubicacion es en `conversacionesUsuario/${idUsuario}` y su valor es el
        //id de la conversacion que se encuentra en el nodo conversaciones
        await push(child(referenciaBaseDatos, `conversacionesUsuario/${idUsuario}`), nuevaConversacion.key);
    }
    return nuevaConversacion.key;
}

// PARA CIFRAR EL MENSAJE
export const enviarMensajeTexto = async (idConversacion, idEmisor, mensaje, ejecutarEncapsular, ejecutarDesencapsular, peticionConversar) => {
    const referenciaBaseDatos = ref(getDatabase(app));
    //La referencia del nodo "mensajes" como se creara en la base de datos
    const referenciaMensajes = child(referenciaBaseDatos, `mensajes/${idConversacion}`);

    let datosMensaje;
    let mensajeCifrado = "";
    if (ejecutarEncapsular === true)
        mensajeCifrado = (await encapsular(referenciaBaseDatos, idConversacion, mensaje)).toString();

    if (ejecutarDesencapsular === true)
        mensajeCifrado = (await desencapsular(referenciaBaseDatos, idConversacion, mensaje)).toString();

    if (ejecutarEncapsular === false && ejecutarDesencapsular === false && peticionConversar === false) {
        let claveSimetrica = await obtenerValor("smk", idConversacion);
        mensajeCifrado = cifrarMensaje(mensaje, claveSimetrica, idConversacion);
    }

    if (ejecutarEncapsular === false && ejecutarDesencapsular === false && peticionConversar === true) {
        datosMensaje = {
            enviadoPor: idEmisor,
            //Primer mensaje en claro
            mensajeTexto: mensaje
        };
    } else {
        datosMensaje = {
            enviadoPor: idEmisor,
            //Mensaje cifrado
            mensajeTexto: mensajeCifrado
        };
    }

    await push(referenciaMensajes, datosMensaje);

    // Actualizar la conversacion para ordenar la lista de conversaciones
    const referenciaConversacion = child(referenciaBaseDatos, `conversaciones/${idConversacion}`);
    await update(referenciaConversacion, {
        actualizadoPor: idEmisor,
        actualizadoEn: new Date().toISOString(),
    });
}

const encapsular = async (referenciaBaseDatos, idConversacion, mensajeTextoPlano) => {
    //La referencia del nodo "clavePublica" como se creara en la base de datos
    const referenciaClavePublica = child(referenciaBaseDatos, `clavePublica/${idConversacion}`);
    const snapshotKyberClavePublica = await get(referenciaClavePublica);
    //Obteniendo la clave publica del objeto que regresa firebase
    const kyberClavePublica = snapshotKyberClavePublica.val().KyberClavePublica;

    //Llamando el algoritmo de encapsulación Kyber utilizando clave publica de Kyber recibida
    const clavesKyber = encapsularKyber(kyberClavePublica);
    const textoCifradoKyber = clavesKyber[0];
    //Actualizando el valor del textocifrado de Kyber en la base de datos
    await update(referenciaClavePublica, {
        KyberTextoCifrado: textoCifradoKyber
    });

    //Generando clave simetrica
    const stringEntradaSal = "P" + snapshotKyberClavePublica.val().creadoPor + "q" + "C" + idConversacion;
    const claveSimetrica = generarClaveSimetrica(stringEntradaSal, clavesKyber[1]);
    await almacenarValor("smk", idConversacion, claveSimetrica);

    return cifrarMensaje(mensajeTextoPlano, claveSimetrica, idConversacion);
}

const desencapsular = async (referenciaBaseDatos, idConversacion, mensajeTextoPlano) => {
    //La referencia del nodo "clavePublica" como se creara en la base de datos
    const referenciaClavePublica = child(referenciaBaseDatos, `clavePublica/${idConversacion}`);
    const snapshotClavePublica = await get(referenciaClavePublica);
    //Obteniendo el texto cifrado de Kyber del objeto que regresa firebase
    const kyberTextoCifrado = snapshotClavePublica.val().KyberTextoCifrado;

    //Obteniendo la clave secreta de async storage
    const claveSecreta = await obtenerValor("sk", idConversacion);

    //Llamando el algoritmo de desencapsulación Kyber utilizando el texto cifrado de Kyber recibido
    const claveCompartida = desencapsularKyber(kyberTextoCifrado, claveSecreta);

    //Generando clave simetrica
    const stringEntradaSal = "P" + snapshotClavePublica.val().creadoPor + "q" + "C" + idConversacion;
    const claveSimetrica = generarClaveSimetrica(stringEntradaSal, claveCompartida);

    //Removiendo la clave secreta de async storage
    await removerValor("sk", idConversacion);
    //Almacenando la clave simetrica
    await almacenarValor("smk", idConversacion, claveSimetrica);

    return cifrarMensaje(mensajeTextoPlano, claveSimetrica, idConversacion);
}

const cifrarMensaje = (mensajeTextoPlano, claveSimetrica, idConversacion) => {
    //Cifrar mensaje
    const stringEntradaIV = "P" + idConversacion + "Q" + "C";
    return cifrarConAES(mensajeTextoPlano, stringEntradaIV, claveSimetrica);
}


const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);