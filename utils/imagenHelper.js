import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import app from './firebaseHelper';
import { v5 as uuidv5 } from 'uuid';
//Notar que no es "firebase/database", tiene que ser "firebase/storage" 
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export const lanzarSelectorImagen = async () => {
    await revisarPermisosMultimedia();

    const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
    });
    if (!resultado.canceled) {
        return resultado.assets[0].uri;
    }
}

const revisarPermisosMultimedia = async () => {
    if (Platform.OS !== 'web') {
        const resultadoPermiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (resultadoPermiso.granted === false) {
            return Promise.reject("Se necesita permiso para acceder a la galería de imagenes.");
        }
    }
    return Promise.resolve();
}

// Utilizar Firebase
export const subirImagenFirebase = async (uri) => {
    // Esta utilizando la imagen que se selecciono localmente
    // y la retorna como un blob(binary large object) para
    // porderla subir a Firebase, porque es el formato que 
    // acepta.
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };

        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };

        xhr.responseType = "blob";

        xhr.open("GET", uri, true);

        xhr.send();

    });


    const rutaDirectorio = "fotosPerfil";
    // Guardando en la Storage de Firebase con un identificador unico
    const referenciaStorageFirebase = ref(getStorage(app), `${rutaDirectorio}/${uuidv5(uri, uuidv5.URL)}`);
    await uploadBytesResumable(referenciaStorageFirebase, blob);
    blob.close();

    return await getDownloadURL(referenciaStorageFirebase);
}