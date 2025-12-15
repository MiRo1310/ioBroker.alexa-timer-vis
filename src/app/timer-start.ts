import type { TimerIndex } from '@/types/types';
import { timerObject } from '@/config/timer-data';
import store from '@/store/store';
import { interval } from '@/app/interval';
import errorLogger from '@/lib/logging';
import { isMoreThanAMinute } from '@/lib/time';
import { getParsedAlexaJson } from '@/app/ioBrokerStateAndObjects';

export const startTimer = async (): Promise<void> => {
    try {
        const availableTimerIndex = getAvailableTimerIndex();
        timerObject.timerStatus[availableTimerIndex] = true;

        const alexaJson = await getParsedAlexaJson();
        if (!alexaJson) {
            return;
        }

        const creationTime = alexaJson.creationTime;

        const timer = timerObject.timer[availableTimerIndex];
        await timer.init({ timerIndex: availableTimerIndex, creationTime });
        const name = timer.getName();
        const sec = timer.calculatedSeconds;

        if (isMoreThanAMinute(sec)) {
            interval(sec, name, timer, store.intervalMore60 * 1000, false);
            return;
        }

        timerObject.timer[availableTimerIndex].setInterval(store.intervalLess60 * 1000);

        interval(sec, name, timer, store.intervalLess60 * 1000, true);
    } catch (e: any) {
        errorLogger.send({ title: 'Error startTimer', e });
    }
};

export function getAvailableTimerIndex(): TimerIndex {
    const timerIndexes = Object.keys(timerObject.timerStatus);
    for (let i = 0; i < timerIndexes.length; i++) {
        const key = timerIndexes[i];

        if (!timerObject.timerStatus[key]) {
            return key;
        }
    }
    return `timer${timerIndexes.length + 1}`;
}
