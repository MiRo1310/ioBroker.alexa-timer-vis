import type { Store, TimerSelector } from '../types/types';
import { timerObject } from '../config/timer-data';
import { useStore } from '../store/store';
import { isString, timeToString } from './global';
import { getInputDevice } from './get-input-device';
import { interval } from './interval';
import type AlexaTimerVis from '../main';
import { registerIdToGetTimerName } from './timer-name';
import { errorLogger } from './logging';

export const startTimer = async (sec: number, name: string, inputString: string): Promise<void> => {
    const store = useStore();
    const _this = store._this;
    try {
        const timerSelector = selectAvailableTimer(_this);

        await getInputDevice(timerObject.timer[timerSelector as keyof typeof timerObject.timer]);
        await registerIdToGetTimerName(timerSelector);

        const jsonAlexa = await _this.getForeignStateAsync(`alexa2.0.History.json`);
        const startTimer: number = getStartTimerValue(jsonAlexa);
        const start_Time = timeToString(startTimer);
        const timerMilliseconds = sec * 1000;
        const endTimeMilliseconds = startTimer + timerMilliseconds;
        const endTimeString = timeToString(endTimeMilliseconds);

        saveToObject(timerSelector, endTimeMilliseconds, endTimeString, start_Time, startTimer);

        await setDeviceNameInStateName(timerSelector, _this, store);

        const timer = timerObject.timer[timerSelector as keyof typeof timerObject.timer];

        if (isMoreThanAMinute(sec)) {
            interval(sec, timerSelector, inputString, name, timer, store.intervalMore60 * 1000, false);
            return;
        }

        timerObject.timer.timer1.timerInterval = store.intervalLess60 * 1000;

        interval(sec, timerSelector, inputString, name, timer, store.intervalLess60 * 1000, true);
    } catch (e: any) {
        errorLogger('Error in startTimer', e, _this);
    }
};

function getStartTimerValue(jsonAlexa: ioBroker.State | null | undefined): number {
    if (isString(jsonAlexa?.val)) {
        return JSON.parse(jsonAlexa.val).creationTime;
    }
    return new Date().getTime();
}

function selectAvailableTimer(_this: AlexaTimerVis): TimerSelector {
    for (let i = 0; i < Object.keys(timerObject.timerActive.timer).length; i++) {
        const key = Object.keys(timerObject.timerActive.timer)[i] as keyof typeof timerObject.timerActive.timer;

        if (!timerObject.timerActive.timer[key]) {
            timerObject.timerActive.timer[key] = true;
            return key;
        }
    }
}

async function setDeviceNameInStateName(
    timerBlock: string | undefined,
    _this: AlexaTimerVis,
    store: Store,
): Promise<void> {
    if (isString(timerBlock)) {
        await _this.setObjectAsync(`alexa-timer-vis.0.${timerBlock}`, {
            type: 'device',
            common: { name: `${store.deviceName}` },
            native: {},
        });
    }
}

function isMoreThanAMinute(sec: number): boolean {
    return sec > 60;
}

function saveToObject(
    timerBlock: TimerSelector,
    endTimeNumber: number,
    endTimeString: string,
    start_Time: string,
    startTimeNumber: number,
): void {
    if (timerBlock) {
        timerObject.timer[timerBlock].endTimeNumber = endTimeNumber;
        timerObject.timer[timerBlock].endTimeString = endTimeString;
        timerObject.timer[timerBlock].startTimeString = start_Time;
        timerObject.timer[timerBlock].startTimeNumber = startTimeNumber;
    }
}
