import { errorLogger } from '@/lib/logging';
import store from '@/app/store';

/**
 * Parse a JSON string and return an object with generic Typ and  with validity status
 *
 * @param val - The JSON string to parse
 */
export function parseJSON<T>(val: string | null): { ob: string; isValidJson: false } | { ob: T; isValidJson: true } {
    const { adapter } = store;
    try {
        return val ? { ob: JSON.parse(val) as T, isValidJson: true } : { ob: val ?? '', isValidJson: false };
    } catch (e) {
        if (adapter) {
            errorLogger.send({ title: 'Error parseJSON:', e });
        }
        return { ob: val ?? '', isValidJson: false };
    }
}
