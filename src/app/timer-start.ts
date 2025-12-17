import type { AlexaActiveTimerList, TimerIndex } from '@/types/types';
import { timers } from '@/config/timer-data';
import store from '@/store/store';
import { interval } from '@/app/interval';
import errorLogger from '@/lib/logging';
import { isMoreThanAMinute } from '@/lib/time';
import { getParsedAlexaJson } from '@/app/ioBrokerStateAndObjects';

export const startTimer = async (newActiveTimer: AlexaActiveTimerList): Promise<void> => {
    try {
        const availableTimerIndex = getAvailableTimerIndex();
        timers.status[availableTimerIndex] = true;

        const alexaJson = await getParsedAlexaJson();
        if (!alexaJson) {
            return;
        }

        const creationTime = alexaJson.creationTime;
        store.adapter.log.warn(`Starting timer at index ${availableTimerIndex} with creationTime ${creationTime}`);
        const timer = timers.timerList[availableTimerIndex];
        await timer.init({ timerIndex: availableTimerIndex, creationTime, newActiveTimer });
        const name = timer.getName();
        const sec = timer.calculatedSeconds;
        store.adapter.log.warn(`Starting timer with sec ${sec}`);

        if (isMoreThanAMinute(sec)) {
            interval(sec, name, timer, store.intervalMore60 * 1000, false);
            return;
        }

        timers.timerList[availableTimerIndex].setInterval(store.intervalLess60 * 1000);

        interval(sec, name, timer, store.intervalLess60 * 1000, true);
    } catch (e: any) {
        errorLogger.send({ title: 'Error startTimer', e });
    }
};

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
