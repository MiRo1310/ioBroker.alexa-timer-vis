import type { TimerIndex, TimerObject } from '@/types/types';
import { timerObject } from '@/config/timer-data';
import { timerParseTimeInput } from '@/app/timer-parse-time-input';
import { findTimer } from '@/app/find-timer';
import { errorLogger } from '@/lib/logging';
import store from '@/store/store';
import type { VoiceInput } from '@/app/voiceInput';

const getMultiplicatorForAddOrSub = (): 1 | -1 => (store.isShortenTimer() ? -1 : 1);

export const extendOrShortTimer = async ({
    voiceInput,
    name,
}: {
    voiceInput: VoiceInput;
    name: string;
}): Promise<void> => {
    try {
        const addOrSub = getMultiplicatorForAddOrSub();

        let firstPartOfValue, valueExtend;
        let extendTime = 0;
        let extendTime2 = 0;

        if (voiceInput.isExtendOrShortenSentence()) {
            firstPartOfValue = voiceInput.getValueExtendBefore();
            valueExtend = voiceInput.getValueExtend();

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
        errorLogger('Error in extendOrShortTimer', e, voiceInput);
    }
};

export function extendTimer(timers: TimerIndex[], sec: number, addOrSub: number, timerObject: TimerObject): void {
    timers.forEach(timer => {
        if (timerObject.timerActive.timer[timer]) {
            timerObject.timer[timer].extendTimer(sec, addOrSub);
        }
    });
}
