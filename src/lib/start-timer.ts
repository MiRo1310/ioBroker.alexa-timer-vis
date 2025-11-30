import type { TimerIndex } from '@/types/types';
import { timerObject } from '@/config/timer-data';
import { useStore } from '@/store/store';
import { isString, timeToString } from '@/lib/global';
import { interval } from '@/lib/interval';
import type AlexaTimerVis from '@/main';
import { errorLogger } from '@/lib/logging';

const isMoreThanAMinute = (sec: number): boolean => sec > 60;

export const startTimer = async (sec: number, name: string): Promise<void> => {
    const store = useStore();
    const _this = store._this;
    try {
        const timerIndex = getAvailableTimerIndex(_this);
        if (!timerIndex) {
            return;
        }
        const alexaJson = await getAlexaParsedAlexaJson(_this);
        if (!alexaJson) {
            return;
        }
        const creationTime = alexaJson.creationTime;
        const startTimeString = timeToString(creationTime);
        const timerMilliseconds = sec * 1000;
        const endTimeNumber = creationTime + timerMilliseconds;
        const endTimeString = timeToString(endTimeNumber);
        const timer = timerObject.timer[timerIndex];
        await timer.init();
        timer.setStartAndEndTime({ creationTime, startTimeString, endTimeNumber, endTimeString });

        await timer.setIdFromEcoDeviceTimerList();

        if (isMoreThanAMinute(sec)) {
            interval(sec, timerIndex, name, timer, store.intervalMore60 * 1000, false);
            return;
        }

        timerObject.timer[timerIndex].setInterval(store.intervalLess60 * 1000);

        interval(sec, timerIndex, name, timer, store.intervalLess60 * 1000, true);
    } catch (e: any) {
        errorLogger('Error in startTimer', e, _this);
    }
};

export interface AlexaJson {
    name: string;
    serialNumber: string;
    summary: string;
    creationTime: number;
    domainApplicationId: string;
    domainApplicationName: string;
    cardContent: string;
    card: string;
    answerText: string;
    utteranceType: string;
    domain: string;
    intent: string;
}

export async function getAlexaParsedAlexaJson(alexaTimerVis: AlexaTimerVis): Promise<AlexaJson | undefined> {
    const instance = useStore().getAlexaInstanceObject().instance;
    const jsonAlexa = await alexaTimerVis.getForeignStateAsync(`alexa2.${instance}.History.json`);
    try {
        if (isString(jsonAlexa?.val)) {
            return JSON.parse(jsonAlexa.val);
        }
    } catch {
        return;
    }
}

function getAvailableTimerIndex(_this: AlexaTimerVis): TimerIndex | undefined {
    for (let i = 0; i < Object.keys(timerObject.timerActive.timer).length; i++) {
        const key = Object.keys(timerObject.timerActive.timer)[i];

        if (!timerObject.timerActive.timer[key]) {
            timerObject.timerActive.timer[key] = true;
            return key;
        }
    }
}
