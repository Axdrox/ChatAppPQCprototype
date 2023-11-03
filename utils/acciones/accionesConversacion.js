import { child, get, getDatabase, push, ref, set, update } from "firebase/database";
import { app } from '../firebaseHelper';
import { cifrarConAES, encapsularKyber, generarClaveSimetrica, generarClavesKyber } from "./criptografia";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const almacenarDatos = async (key, value) => {
    try {
        await ReactNativeAsyncStorage.setItem(key, value);
    } catch (e) {
        console.log("Error: " + e);
    }
};

const obtenerValor = async (key) => {
    try {
        const valor = await ReactNativeAsyncStorage.getItem(key);
        return valor;
    } catch (e) {
        console.log("Error: " + e);
    }

    console.log('Done.')
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
    almacenarDatos(nuevaConversacion.key, clavesKyber[1]);
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

// AQUI SE PUEDE UTILIZAR CRIPTOGRAFIA PARA CIFRAR EL MENSAJE
export const enviarMensajeTexto = async (idConversacion, idEmisor, mensajeTexto, encapsularClavePublica, desencapsular) => {
    const referenciaBaseDatos = ref(getDatabase(app));
    //La referencia del nodo "mensajes" como se creara en la base de datos
    const referenciaMensajes = child(referenciaBaseDatos, `mensajes/${idConversacion}`);

    
    let mensajeCifrado = "";
    if (encapsularClavePublica === true) {
        //La referencia del nodo "clavePublica" como se creara en la base de datos
        const referenciaClavePublica = child(referenciaBaseDatos, `clavePublica/${idConversacion}`);
        const snapshotKyberClavePublica = await get(referenciaClavePublica);
        //Obteniendo la clave publica del objeto que regresa firebase
        const kyberClavePublica = snapshotKyberClavePublica.val().KyberClavePublica;

        //Llamando el algoritmo de encapsulación Kyber con la clave publica recibida
        const clavesKyber = encapsularKyber(kyberClavePublica);
        const textoCifradoKyber = clavesKyber[0];
        //Actualizando el valor del textocifrado de Kyber en la base de datos
        await update(referenciaClavePublica, {
            KyberTextoCifrado: textoCifradoKyber
        });

        //Generando clave simetrica
        const stringEntradaSal = "P" + snapshotKyberClavePublica.val().creadoPor + "q" + idEmisor + "C";
        const claveSimetrica = generarClaveSimetrica(stringEntradaSal, clavesKyber[1]);
        almacenarDatos(idConversacion, claveSimetrica);

        //Cifrar mensaje
        let fecha = new Date;
        const stringEntradaIV = "A" + fecha.getMonth() + "L" + idEmisor + fecha.getFullYear() + "E";
        mensajeCifrado = cifrarConAES(mensajeTexto, stringEntradaIV, claveSimetrica);    

    }

    const datosMensaje = {
        enviadoPor: idEmisor,
        //enviadoEn: new Date().toISOString(),
        //MENSAJE CIFRADO
        mensajeTexto: mensajeCifrado
    };

    await push(referenciaMensajes, datosMensaje);

    // Actualizar la conversacion para ordenar la lista de conversaciones
    const referenciaConversacion = child(referenciaBaseDatos, `conversaciones/${idConversacion}`);
    await update(referenciaConversacion, {
        actualizadoPor: idEmisor,
        actualizadoEn: new Date().toISOString(),
    });
}