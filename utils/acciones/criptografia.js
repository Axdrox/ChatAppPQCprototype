global.Buffer = require('buffer').Buffer;

// Referencia a la implementacion de Kyber
const kyber = require('crystals-kyber');

import CryptoES from 'crypto-es';

export const generarClavesKyber = () => {
    // Para generar par de claves de Kyber: publica y secreta (pk, sk)
    let pk_sk = kyber.KeyGen768();
    let pk = pk_sk[0];
    let sk = pk_sk[1];

    // Pasar buffer a string de base 64
    const pk_base64 = Buffer.from(pk).toString('base64');
    const sk_base64 = Buffer.from(sk).toString('base64');

    console.log("public key: " + pk_base64.length + " secret key: " + sk_base64.length);

    return [pk_base64, sk_base64];
}

export const encapsularKyber = (pk) => {
    // Pasar de un string base 64 a buffer
    const pk_buffer = Buffer.from(pk, 'base64');

    // Genera una clave simetrica de 256 bits (clave compartida: ss) y un texto cifrado (c)
    let c_ss = kyber.Encrypt768(pk_buffer);
    let c = c_ss[0];
    let ss1 = c_ss[1];

    // Pasar buffer a string de base 64
    const c_base64 = Buffer.from(c).toString('base64');
    const ss1_base64 = Buffer.from(ss1).toString('base64');

    return [c_base64, ss1_base64];
}

export const desencapsularKyber = (c, sk) => {
    // Pasar de un string base 64 a buffer
    const c_buffer = Buffer.from(c, 'base64');
    const sk_buffer = Buffer.from(sk, 'base64');

    // Para desencapsular y obtener la misma clave simetrica (clave compartida: ss)
    let ss2 = kyber.Decrypt768(c_buffer, sk_buffer);

    const ss2_base64 = Buffer.from(ss2).toString('base64');

    return ss2_base64;
}

export const generarClaveSimetrica = (entradaSal, claveCompartida) => {
    const salt = CryptoES.MD5(entradaSal);
    const claveEntrada = CryptoES.enc.Base64.parse(claveCompartida);
    //Para guardarlo en async storage
    const key128Bits = CryptoES.PBKDF2(claveEntrada, salt, { keySize: 128 / 32 }).toString(CryptoES.enc.Base64);
    return key128Bits;
}

export const cifrarConAES = (textoPlano, entradaIV, claveSimetrica) => {
    const wordsClaveSimetrica = CryptoES.enc.Base64.parse(claveSimetrica);
    const iv = CryptoES.MD5(entradaIV);
    return CryptoES.AES.encrypt(textoPlano, wordsClaveSimetrica, { iv: iv, mode: CryptoES.mode.CTR }).ciphertext.toString(CryptoES.enc.Base64);
}

export const descifrarConAES = (textoCifrado, entradaIV, claveSimetrica) => {
    const wordsTextoCifrado = CryptoES.enc.Base64.parse(textoCifrado);
    const wordsClaveSimetrica = CryptoES.enc.Base64.parse(claveSimetrica);

    const iv = CryptoES.MD5(entradaIV);

    return CryptoES.AES.decrypt({ ciphertext: wordsTextoCifrado }, wordsClaveSimetrica, { iv: iv, mode: CryptoES.mode.CTR }).toString(CryptoES.enc.Utf8);
}