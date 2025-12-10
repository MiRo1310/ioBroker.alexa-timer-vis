/**
 * Deep copy an object
 *
 * @param obj - The object to deep copy
 */
export const deepCopy = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Sort an array based on the third element of its sub-arrays
 *
 * @param array - The array to sort
 */
export function sortArray(array: any[]): any[] {
    return array.sort(function (a: any[], b: any[]) {
        return a[2] - b[2];
    });
}

export const isDefined = <T>(value: T | undefined | null): value is T => value !== undefined && value !== null;
