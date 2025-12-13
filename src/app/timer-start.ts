import type { TimerIndex } from '@/types/types';
import { timerObject } from '@/config/timer-data';
import store from '@/store/store';
import { interval } from '@/app/interval';
import errorLogger from '@/lib/logging';
import { isMoreThanAMinute } from '@/lib/time';
import { getParsedAlexaJson } from '@/app/ioBrokerStateAndObjects';

export const startTimer = async (): Promise<void> => {
    try {
        const timerIndex = getAvailableTimerIndex();
        timerObject.timerStatus[timerIndex] = true;

        const alexaJson = await getParsedAlexaJson();
        if (!alexaJson) {
            return;
        }

        const creationTime = alexaJson.creationTime;

        const timer = timerObject.timer[timerIndex];
        await timer.init({ timerIndex, creationTime });
        const name = timer.getName();
        const sec = timer.calculatedSeconds;
        if (isMoreThanAMinute(sec)) {
            interval(sec, name, timer, store.intervalMore60 * 1000, false);
            return;
        }

        timerObject.timer[timerIndex].setInterval(store.intervalLess60 * 1000);

        interval(sec, name, timer, store.intervalLess60 * 1000, true);
    } catch (e: any) {
        errorLogger.send({ title: 'Error startTimer', e });
    }
};

export function getAvailableTimerIndex(): TimerIndex {
    const keys = Object.keys(timerObject.timerStatus);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (!timerObject.timerStatus[key]) {
            return key;
        }
    }
    return `timer${keys.length + 1}`;
}
