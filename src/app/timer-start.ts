import type { AlexaActiveTimerList, TimerIndex } from '@/types/types';
import { obj } from '@/config/timer-data';
import store from '@/store/store';
import { interval } from '@/app/interval';
import { errorLogger } from '@/lib/logging';
import { isMoreThanAMinute } from '@/lib/time';

export const startTimer = async (newActiveTimer: AlexaActiveTimerList): Promise<void> => {
    try {
        const availableTimerIndex = getAvailableTimerIndex();
        obj.status[availableTimerIndex] = true;

        const timer = obj.timers[availableTimerIndex];
        await timer.init({ timerIndex: availableTimerIndex, newActiveTimer });
        timer.setInterval(store.intervalSecLessThan60Sec * 1000);

        if (isMoreThanAMinute(timer.calculatedSeconds)) {
            interval(timer, store.intervalSecMoreThan60Sec * 1000, false);
            return;
        }

        interval(timer, store.intervalSecLessThan60Sec * 1000, true);
    } catch (e: any) {
        errorLogger.send({ title: 'Error startTimer', e });
    }
};

/**
 * Get an available timer index or create a new one
 *
 * @returns - The available timer index
 */
export function getAvailableTimerIndex(): TimerIndex {
    const timerIndexes = Object.keys(obj.status)
        .filter(key => key.startsWith('timer'))
        .sort();
    const index = timerIndexes.find(index => !obj.status[index]);

    return index ? index : `timer${timerIndexes.length + 1}`;
}
