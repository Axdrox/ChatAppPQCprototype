global.Buffer = require('buffer').Buffer;

// Referencia a la implementacion de Kyber
const kyber = require('crystals-kyber');

import CryptoES from 'crypto-es';

export const generarClavesKyber = () => {
    // Para generar par de claves de Kyber: publica y secreta (pk, sk)
    let pk_sk = kyber.KeyGen512();
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
    let c_ss = kyber.Encrypt512(pk_buffer);
    let c = c_ss[0];
    let ss1 = c_ss[1];

    // Pasar buffer a string de base 64
    const c_base64 = Buffer.from(c).toString('base64');
    const ss1_base64 = Buffer.from(ss1).toString('base64');

    console.log(ss1_base64);

    return c_base64;
}

export const desencapsularKyber = (c, sk) => {
    // Pasar de un string base 64 a buffer
    const c_buffer = Buffer.from(c, 'base64');
    const sk_buffer = Buffer.from(sk, 'base64');

    // Para desencapsular y obtener la misma clave simetrica (clave compartida: ss)
    let ss2 = kyber.Decrypt512(c_buffer, sk_buffer);

    const ss2_base64 = Buffer.from(ss2).toString('base64');

    console.log(ss2_base64);
}