import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const salt = crypto.randomBytes(16);

/**
 * Encrypts a value using a predefined algorithm, key, and IV.
 *
 * @param {string} value - The value to be encrypted.
 * @returns {string} The encrypted value as a hexadecimal string.
 *
 * @throws {Error} If encryption fails (e.g., due to an invalid key or IV).
 */
export const encrypt = (value: string) => {

    const saltedInput = salt.toString('hex') + value;

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(saltedInput, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted
}

/**
 * Decrypts an encrypted value using a predefined algorithm, key, and IV.
 *
 * @param {string} value - The encrypted value as a hexadecimal string.
 * @returns {string} The decrypted data as a UTF-8 string.
 *
 * @throws {Error} If decryption fails (e.g., due to an invalid key, IV, or corrupted data).
 */
export const decrypt = (value: string) => {

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const originalSalt = decrypted.slice(0, 32);
    const originalData = decrypted.slice(32);

    return originalData

}
