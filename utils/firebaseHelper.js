// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyClLK3QrR6g-kpdXWJLrNjZB6Nvksvmlpc",
    authDomain: "chat-app-pqc-prototype.firebaseapp.com",
    projectId: "chat-app-pqc-prototype",
    storageBucket: "chat-app-pqc-prototype.appspot.com",
    messagingSenderId: "103731554430",
    appId: "1:103731554430:web:02c8af94c72333e8e9102f",
    measurementId: "G-944FRS6S03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) });

export default app;

