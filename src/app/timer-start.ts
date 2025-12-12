import type { TimerIndex } from '@/types/types';
import { timerObject } from '@/config/timer-data';
import store from '@/store/store';
import { interval } from '@/app/interval';
import errorLogger from '@/lib/logging';
import { isMoreThanAMinute, secToHourMinSec, timeToString } from '@/lib/time';
import { getParsedAlexaJson } from '@/app/ioBrokerStateAndObjects';

export const startTimer = async (sec: number, name: string): Promise<void> => {
    try {
        const timerIndex = getAvailableTimerIndex();
        timerObject.timerActive.timer[timerIndex] = true;

        const alexaJson = await getParsedAlexaJson();
        if (!alexaJson) {
            return;
        }

        const creationTime = alexaJson.creationTime;
        const startTimeString = timeToString(creationTime);
        const timerMilliseconds = sec * 1000;
        const endTimeNumber = creationTime + timerMilliseconds;
        const endTimeString = timeToString(endTimeNumber);
        const timer = timerObject.timer[timerIndex];
        const result = secToHourMinSec(sec, true);
        await timer.init({
            timerIndex,
            creationTime,
            startTimeString,
            endTimeNumber,
            endTimeString,
            initialTimerString: result.initialString,
        });

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
    const keys = Object.keys(timerObject.timerActive.timer);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (!timerObject.timerActive.timer[key]) {
            return key;
        }
    }
    return `timer${keys.length + 1}`;
}
