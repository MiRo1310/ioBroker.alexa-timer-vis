import { timerObject } from '@/config/timer-data';

export const getAbortWord = (voiceInput: string): string | undefined =>
    timerObject.timerActive.data.abortWords.find(word =>
        voiceInput.toLocaleLowerCase().includes(word.toLocaleLowerCase()),
    );
