/* eslint-disable no-bitwise */

/**
 * Generate a random string.
 * @param alphabet set of characters that can be present in the resulting string.
 * @param size string length.
 * @param getRandom function responsible for generating a random character.
 */
const customRandom = (
    alphabet: string,
    size: number,
    getRandom: (bytes: number) => Uint8Array,
): string => {
    if (size === 0 || Number.isNaN(size)) return '';

    const mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1;
    const step = -~((1.6 * mask * size) / alphabet.length);

    let id = '';
    while (true) {
        const bytes = getRandom(step);
        let j = step;
        while (j--) {
            id += alphabet[bytes[j]! & mask] || '';
            if (id.length === +size) return id;
        }
    }
};

/**
 * Get a typed array of 8-bit integers unsigned values
 * filled with random characters based on the Web Crypto API.
 * @param bytes array length.
 */
const random = (bytes: number): Uint8Array => crypto.getRandomValues(new Uint8Array(bytes));

/**
 * Generate a random string based on the Web Crypto API.
 * @param alphabet the set of characters that can be present in the resulting string.
 * @param size string length.
 */
export const customAlphabet = (alphabet: string, size: number): string =>
    customRandom(alphabet, size, random);
