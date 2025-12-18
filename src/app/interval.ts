import { timers } from '@/config/timer-data';
import store from '@/store/store';
import type { Timer } from '@/app/timer';
import { generateTimerValues } from '@/app/generate-timer-values';
import { secToHourMinSec } from '@/lib/time';

const isIndexInInterval = (timerIndex: string): boolean =>
    timerIndex in timers.interval && timers.interval[timerIndex] !== null;

export const interval = (timer: Timer, int: number, singleInstance: boolean): void => {
    const adapter = store.adapter;
    const timerIndex = timer.getTimerIndex();

    if (!timerIndex) {
        return;
    }
    generateTimerValues(timer);

    const { string } = secToHourMinSec(timer.calculatedSeconds, false);
    timer.setLengthTimer(string);
    if (isIndexInInterval(timerIndex) || !timer.isActive) {
        return;
    }

    timers.interval[timerIndex] = adapter.setInterval(async () => {
        const timeLeftSec = generateTimerValues(timer);

        if (timeLeftSec <= 60 && !singleInstance) {
            singleInstance = true;

            if (isIndexInInterval(timerIndex)) {
                clearIntervalByTimerIndex(timerIndex, timer);
            }

            interval(timer, timer.getInterval(), true);
        }

        if (timeLeftSec <= 0 || !timers.status[timerIndex]) {
            //TODO remove log
            store.adapter.log.debug(JSON.stringify(timers.status[timerIndex]));
            timers.count.decrement();
            await timer.reset();

            adapter.log.debug('Timer stopped');

            clearIntervalByTimerIndex(timerIndex, timer);
        }
    }, int);
};

function clearIntervalByTimerIndex(timerIndex: string, timer: Timer): void {
    store.adapter.clearInterval(timers.interval[timerIndex]);
    timer.isActive = false;
    timers.interval[timerIndex] = null;
}
