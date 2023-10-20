import { child, getDatabase, push, ref, update } from "firebase/database";
import { app } from '../firebaseHelper';

// AQUI SE PUEDE UTILIZAR CRIPTOGRAFIA PARA LA PARTE DE SUBIR LA CLAVE PUBLICA DE KYBER
export const crearConversacion = async (idUsuarioQueInicioSesion, datosConversacion) => {
    const newDatosConversacion = {
        ...datosConversacion,
        //SE PODRIAN QUITAR
        //creadoPor: idUsuarioQueInicioSesion,
        actualizadoPor: idUsuarioQueInicioSesion,
        //creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString()
        //CLAVEPUBLICAKYBER
    };

    const referenciaBaseDatos = ref(getDatabase(app));
    //En donde se va a realizar la creacion de la conversacion en la base de datos de Firebase, el nodo es 'conversaciones'
    const nuevaConversacion = await push(child(referenciaBaseDatos, 'conversaciones'), newDatosConversacion);

    //console.log(nuevaConversacion.key);

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
export const enviarMensajeTexto = async (idConversacion, idEmisor, mensajeTexto) => {
    const referenciaBaseDatos = ref(getDatabase(app));
    //La referencia del nodo "mensajes" como se creara en la base de datos
    const referenciaMensajes = child(referenciaBaseDatos, `mensajes/${idConversacion}`);

    const datosMensaje = {
        enviadoPor: idEmisor,
        //enviadoEn: new Date().toISOString(),
        //MENSAJE CIFRADO
        mensajeTexto: mensajeTexto
    };

    await push(referenciaMensajes, datosMensaje);

    // Actualizar la conversacion para ordenar la lista de conversaciones
    const referenciaConversacion = child(referenciaBaseDatos, `conversaciones/${idConversacion}`);
    await update(referenciaConversacion, {
        actualizadoPor: idEmisor,
        actualizadoEn: new Date().toISOString(),
    });
}