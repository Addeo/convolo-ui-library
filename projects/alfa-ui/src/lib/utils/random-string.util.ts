import { customAlphabet } from './custom-alphabet.util';

/**
 * Generate a random string consisting of numbers,
 * letters of the Latin alphabet, hyphens and underscores.
 * @param size string length.
 */
export const randomString = (size = 20): string => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';
  return customAlphabet(alphabet, size);
};
