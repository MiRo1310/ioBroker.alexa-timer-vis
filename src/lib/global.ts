import store from '@/store/store';

export function firstLetterToUpperCase(name: string): string {
    if (name.length === 0) {
        return '';
    }
    if (name.length === 1) {
        return name.toUpperCase();
    }

    return name.slice(0, 1).toUpperCase() + name.slice(1); // Erster Buchstabe in Groß + ReststartTimer
}

export function timeToString(milliseconds: number): string {
    const date_string = new Date(milliseconds).toString();
    return date_string.split(' ').slice(4, 5).toString();
}

export function isAlexaSummaryStateChanged({
    state,
    id,
}: {
    state?: ioBroker.State | null;
    id: string;
}): boolean | null | undefined {
    return state && isString(state.val) && state.val !== '' && id === store.pathAlexaStateToListenTo;
}

export function doesAlexaSendAQuestion(voiceInput: string): void {
    store.questionAlexa = voiceInput.indexOf(',') != -1;
}

export const isStringEmpty = (str: string): boolean => {
    return str === '';
};

export function isString(str?: string | number | boolean | object | null): str is string {
    return typeof str == 'string';
}

export const isIobrokerValue = (obj: ioBroker.State | null | undefined): obj is ioBroker.State =>
    !!obj && obj.val !== null && obj.val !== undefined;

export function sortArray(array: any[]): any[] {
    return array.sort(function (a: any[], b: any[]) {
        return a[2] - b[2];
    });
}

export function countOccurrences(str: string, char: string): number {
    return str.split(char).length - 1;
}
