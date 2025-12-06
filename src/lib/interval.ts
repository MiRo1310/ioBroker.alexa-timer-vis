import { timerObject } from '@/config/timer-data';
import store from '@/store/store';
import { errorLogger } from '@/lib//logging';
import type { Timer } from '@/app/timer';
import { generateValues } from '@/lib/generate-values';
import { resetTimer } from '@/app/reset';
import { secToHourMinSec } from '@/lib/time';

export const interval = (sec: number, name: string, timer: Timer, int: number, onlyOneTimer: boolean): void => {
    const adapter = store.adapter;
    const timerIndex = timer.getTimerIndex();

    if (!timerIndex) {
        return;
    }
    generateValues(timer, sec, name);

    const { string } = secToHourMinSec(sec, false);
    timer.setLengthTimer(string);
    if (timerObject.interval[timerIndex as keyof typeof timerObject.interval] || !timer.isActive) {
        return;
    }

    timerObject.interval[timerIndex as keyof typeof timerObject.interval] = adapter.setInterval(() => {
        const timeLeftSec = generateValues(timer, sec, name);

        if (timeLeftSec <= 60 && !onlyOneTimer) {
            onlyOneTimer = true;

            if (timerObject.interval[timerIndex as keyof typeof timerObject.interval]) {
                clearIntervalByTimerIndex(timerIndex, timer);
            }

            interval(sec, name, timer, timerObject.timer[timerIndex].getInterval(), true);
        }

        if (timeLeftSec <= 0 || !timerObject.timerActive.timer[timerIndex]) {
            timerObject.timerActive.timerCount--;

            resetTimer(timer).catch((e: any) => {
                errorLogger('Error in interval', e);
            });

            adapter.log.debug('Timer stopped');

            if (timerObject.interval[timerIndex as keyof typeof timerObject.interval]) {
                clearIntervalByTimerIndex(timerIndex, timer);
            }
        }
    }, int);
};

function clearIntervalByTimerIndex(timerIndex: string, timer: Timer): void {
    store.adapter.clearInterval(timerObject.interval[timerIndex as keyof typeof timerObject.interval]);
    timer.isActive = false;
    timerObject.interval[timerIndex as keyof typeof timerObject.interval] = null;
}
