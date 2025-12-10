import type { TimerIndex, TimerObject } from '@/types/types';
import { timerObject } from '@/config/timer-data';
import { timerParseTimeInput } from '@/app/timer-parse-time-input';
import { findTimer } from '@/app/find-timer';
import { errorLogger } from '@/lib/logging';
import store from '@/store/store';

const getMultiplikatorForAddOrSub = (): 1 | -1 => (store.isShortenTimer() ? -1 : 1);

export const extendOrShortTimer = async ({ voiceInput, name }: { voiceInput: string; name: string }): Promise<void> => {
    try {
        const addOrSub = getMultiplikatorForAddOrSub();

        let firstPartOfValue, valueExtend;
        let extendTime = 0;
        let extendTime2 = 0;

        if (voiceInput.includes('um')) {
            const indexOfUm = voiceInput.indexOf('um');
            firstPartOfValue = voiceInput.slice(0, indexOfUm).split(' ');
            valueExtend = voiceInput.slice(indexOfUm + 2).split(' ');

            const { stringToEvaluate } = timerParseTimeInput(firstPartOfValue);
            extendTime = eval(stringToEvaluate);
            const { stringToEvaluate: string2 } = timerParseTimeInput(valueExtend);
            extendTime2 = eval(string2);
        }

        const timers = await findTimer(extendTime, name, 1, voiceInput);

        if (timers.timer) {
            extendTimer(timers.timer, extendTime2, addOrSub, timerObject);
            return;
        }
        if (timers.oneOfMultiTimer) {
            extendTimer(timers.timer, extendTime2, addOrSub, timerObject);
        }
    } catch (e: any) {
        errorLogger('Error in extendOrShortTimer', e);
    }
};

export function extendTimer(timers: TimerIndex[], sec: number, addOrSub: number, timerObject: TimerObject): void {
    timers.forEach(timer => {
        if (timerObject.timerActive.timer[timer]) {
            timerObject.timer[timer].extendTimer(sec, addOrSub);
        }
    });
}
