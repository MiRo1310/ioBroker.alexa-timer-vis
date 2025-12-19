import type AlexaTimerVis from '@/main';
import errorLogger from '@/lib/logging';

/**
 * Convert the first letter of a string to uppercase
 *
 * @param name - The input string
 */
export const firstLetterToUpperCase = (name: string): string => name.slice(0, 1).toUpperCase() + name.slice(1);

/**
 * Check if a string is empty
 *
 * @param str - The input string
 */
export const isStringEmpty = (str: string): boolean => str === '';

/**
 * Count occurrences of a character in a string
 *
 * @param str - The input string
 * @param char - The character to count
 */
export const countOccurrences = (str: string, char: string): number => str.split(char).length - 1;

/**
 * Type guard to check if a variable is a string
 *
 * @param str - The variable to check
 */
export const isString = (str?: string | number | boolean | object | null): str is string => typeof str == 'string';

export function parseJSON<T>(
    val: string | null,
    adapter?: AlexaTimerVis,
): { ob: string; isValidJson: false } | { ob: T; isValidJson: true } {
    try {
        return val ? { ob: JSON.parse(val) as T, isValidJson: true } : { ob: val ?? '', isValidJson: false };
    } catch (e) {
        if (adapter) {
            errorLogger.send({ title: 'Error parseJSON:', e });
        }
        return { ob: val ?? '', isValidJson: false };
    }
}
