import CryptoJS from 'crypto-js';

/**
 * Encodes a string into Base64
 * @param input The string to encode
 * @returns The encoded Base64 string
 */
export function base64encode(input: string) {
  return btoa(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Encrypts a given string with the Sha256 algorithm
 * @param input Input string to hash
 * @returns Hashed input string
 */
export function encryptSha256(input: string) {
  return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
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
 * Checks if current environment is 'Production'
 * @returns 'true' if environment is 'Production', otherwise 'false'
 */
export function isProductionEnv() {
  const envName = import.meta.env.VITE_ENV;
  return envName === 'PROD';
}
