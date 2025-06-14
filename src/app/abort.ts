import { timerObject } from '../config/timer-data';
import type AlexaTimerVis from '../main';

export const isAbortWord = (voiceInput: string, _this: AlexaTimerVis): boolean => {
    const input = voiceInput.toLocaleLowerCase();

    const result = timerObject.timerActive.data.abortWords.find(word => {
        return input.includes(word.toLocaleLowerCase());
    });
    return !!result;
};
