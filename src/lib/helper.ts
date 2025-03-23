import { enc, SHA256 } from 'crypto-js';

/**
 * Generates a sha256 hashed, base64 encoded code challenge from the code verifier
 * @param codeVerifier The code verifier input string
 * @returns The code challenge string
 */
export function generateCodeChallenge(codeVerifier: string) {
  const hash = SHA256(codeVerifier);
  const hashed = hash.toString(enc.Base64).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return hashed;
}

/**
 * Generates a 64 character random string and saves it in the local storage
 * @returns The 64 character codeVerifier string
 */
export function generateCodeVerifier() {
  const codeVerifier = generateRandomString(64);
  window.localStorage.setItem('code_verifier', codeVerifier);
  return codeVerifier;
}

/**
 * Generates a random string with given length
 * @param length The length of the output string
 * @returns A random string with given length
 */
export function generateRandomString(length: number) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Generates a 16 character random string and saves it in the local storage
 * @returns The 16 character state string
 */
export function generateState() {
  const state = generateRandomString(16);
  window.localStorage.setItem('state', state);
  return state;
}

/**
 * Checks if current environment is 'Production'
 * @returns 'true' if environment is 'Production', otherwise 'false'
 */
export function isProductionEnv() {
  const envName = import.meta.env.VITE_ENV;
  return envName === 'PROD';
}
