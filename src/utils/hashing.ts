import { pbkdf2 } from 'crypto';
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);

const iterations = 100000;
const keyLength = 64;
const digest = 'sha256';
const salt = 'f094e8cdf45d36de95993583338a5163'
// const saltLength = 16;
// const salt = randomBytes(saltLength).toString('hex');

/**
 * Hashes a password using the PBKDF2 algorithm.
 *
 * @param {string} password - The password to be hashed.
 * @returns {string} The hashed password as a hexadecimal string.
 */
export const hashValue = async (password: string) => {
    try {
        const hash = (await pbkdf2Async(password, salt, iterations, keyLength, digest)).toString('hex');
        return hash;
    } catch (error) { console.error(error) }
}

/**
 * Verifies if the provided password matches the stored hash.
 *
 * This function hashes the provided password using the same PBKDF2 algorithm 
 * and compares the result with the stored hash.
 *
 * @param {string} password - The password to verify.
 * @param {string} hash - The stored hash to compare the derived hash against.
 * @returns {boolean} `true` if the password matches the hash, `false` otherwise.
 */
export const hashVerifyValue = async (password: string, hash: string) => {
    try {
        const derivedHash = await pbkdf2Async(password, salt, iterations, keyLength, digest);
        return derivedHash.toString('hex') === hash;

    } catch (error) { console.error(error) }
}