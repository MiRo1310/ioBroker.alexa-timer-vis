import { timerObject } from '@/config/timer-data';
import store from '@/store/store';
import type { Timer } from '@/app/timer';
import { generateTimerValues } from '@/app/generate-timer-values';
import { secToHourMinSec } from '@/lib/time';

function isIndexInInterval(timerIndex: string): boolean {
    return timerIndex in timerObject.iobrokerInterval;
}

export const interval = (sec: number, name: string, timer: Timer, int: number, singleInstance: boolean): void => {
    const adapter = store.adapter;
    const timerIndex = timer.getTimerIndex();

    if (!timerIndex) {
        return;
    }
    generateTimerValues(timer, sec, name);

    const { string } = secToHourMinSec(sec, false);
    timer.setLengthTimer(string);
    if (isIndexInInterval(timerIndex) || !timer.isActive) {
        return;
    }

    timerObject.iobrokerInterval[timerIndex] = adapter.setInterval(async () => {
        const timeLeftSec = generateTimerValues(timer, sec, name);

        if (timeLeftSec <= 60 && !singleInstance) {
            singleInstance = true;

            if (isIndexInInterval(timerIndex)) {
                clearIntervalByTimerIndex(timerIndex, timer);
            }

            interval(sec, name, timer, timerObject.timer[timerIndex].getInterval(), true);
        }

        if (timeLeftSec <= 0 || !timerObject.timerStatus[timerIndex]) {
            timerObject.timerCount--;
            await timer.reset();

            adapter.log.debug('Timer stopped');

            if (isIndexInInterval(timerIndex)) {
                clearIntervalByTimerIndex(timerIndex, timer);
            }
        }
    }, int);
};

function clearIntervalByTimerIndex(timerIndex: string, timer: Timer): void {
    store.adapter.clearInterval(timerObject.iobrokerInterval[timerIndex]);
    timer.isActive = false;
    timerObject.iobrokerInterval[timerIndex] = null;
}
