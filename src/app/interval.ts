import { obj } from '@/config/timer-data';
import store from '@/store/store';
import type { Timer } from '@/app/timer';
import { generateTimerValues } from '@/app/generate-timer-values';
import { secToHourMinSec } from '@/lib/time';

const isIndexInInterval = (timerIndex: string): boolean =>
    timerIndex in obj.interval && obj.interval[timerIndex] !== null;

export const interval = (timer: Timer, int: number, singleInstance: boolean): void => {
    const adapter = store.adapter;
    const timerIndex = timer.getTimerIndex();

    if (!timerIndex) {
        return;
    }
    generateTimerValues(timer);

    const { stringTimer } = secToHourMinSec(timer.calculatedSeconds, false);
    timer.setLengthTimer(stringTimer);

    if (isIndexInInterval(timerIndex) || !timer.isActive) {
        return;
    }

    obj.interval[timerIndex] = adapter.setInterval(async () => {
        const timeLeftSec = generateTimerValues(timer);

        if (timeLeftSec <= 60 && !singleInstance) {
            singleInstance = true;

            clearIntervalByTimerIndex(timerIndex);
            timer.setInactive();

            interval(timer, timer.getInterval(), true);
        }

        if (timeLeftSec <= 0 || !obj.status[timerIndex]) {
            obj.count.decrement();
            await timer.reset();

            adapter.log.debug(`Timer "${timerIndex}" stopped`);

            clearIntervalByTimerIndex(timerIndex);
            timer.setInactive();
        }
    }, int);
};

/**
 * Clear interval by timer index and sets the internal interval to null
 *
 * @param timerIndex - The timer index
 */
function clearIntervalByTimerIndex(timerIndex: string): void {
    store.adapter.clearInterval(obj.interval[timerIndex]);
    obj.interval[timerIndex] = null;
}
