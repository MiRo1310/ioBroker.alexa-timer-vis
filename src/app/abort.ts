import { timerObject } from '../config/timer-data';
import type AlexaTimerVis from '../main';

export const getAbortWord = (voiceInput: string, _this: AlexaTimerVis): string | undefined => {
    const input = voiceInput.toLocaleLowerCase();

    return timerObject.timerActive.data.abortWords.find(word => {
        return input.includes(word.toLocaleLowerCase());
    });
};
