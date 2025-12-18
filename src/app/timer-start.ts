import type { AlexaActiveTimerList, TimerIndex } from '@/types/types';
import { timers } from '@/config/timer-data';
import store from '@/store/store';
import { interval } from '@/app/interval';
import errorLogger from '@/lib/logging';
import { isMoreThanAMinute } from '@/lib/time';

export const startTimer = async (newActiveTimer: AlexaActiveTimerList): Promise<void> => {
    try {
        const availableTimerIndex = getAvailableTimerIndex();
        timers.status[availableTimerIndex] = true;

        const timer = timers.timerList[availableTimerIndex];
        await timer.init({ timerIndex: availableTimerIndex, newActiveTimer });
        timer.setInterval(store.intervalLess60 * 1000);

        if (isMoreThanAMinute(timer.calculatedSeconds)) {
            interval(timer, store.intervalMore60 * 1000, false);
            return;
        }

        interval(timer, store.intervalLess60 * 1000, true);
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
    const timerIndexes = Object.keys(timers.status).filter(key => key.startsWith('timer'));
    for (let i = 0; i < timerIndexes.length; i++) {
        const key = timerIndexes[i];

        if (!timers.status[key]) {
            return key;
        }
    }
    return `timer${timerIndexes.length + 1}`;
}
