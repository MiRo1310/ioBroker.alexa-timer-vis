import store from '@/store/store';
import { timerObject } from '@/config/timer-data';

import type { OneOfMultiTimer, TimerIndex } from '@/types/types';
import { errorLogger } from '@/lib/logging';
import type { Timer } from '@/app/timer';
import { isIobrokerValue } from '@/lib/state';
import { isString } from '@/lib/string';

export const findTimer = async (
    sec: number,
    name: string,
    deleteTimerIndex: number,
    value: string,
): Promise<{ oneOfMultiTimer: OneOfMultiTimer; timer: TimerIndex[] }> => {
    const adapter = store.adapter;
    try {
        name = name.trim();
        let inputDevice = '';

        const obj = await adapter.getForeignStateAsync(
            `alexa2.${store.getAlexaInstanceObject().instance}.History.name`,
        );

        if (isIobrokerValue(obj) && isString(obj.val)) {
            inputDevice = obj.val;
        }

        const { matchingTime, matchingName, matchingInputDevice } = getMatchingTimerCounts(inputDevice, sec, name);

        const timerFound: {
            oneOfMultiTimer: OneOfMultiTimer;
            timer: TimerIndex[];
        } = { oneOfMultiTimer: {} as OneOfMultiTimer, timer: [] };

        if (store.questionAlexa) {
            if (matchingName == 1) {
                timerFound.oneOfMultiTimer = { value: '', sec: 0, name, inputDevice };
            } else if (matchingTime > 1) {
                // Einer, mit genauer Zeit, mehrmals vorhanden
                timerFound.oneOfMultiTimer = { value, sec, name: '', inputDevice: '' };
            } else if (matchingInputDevice != timerObject.timerActive.timerCount) {
                // Einer, mit genauer Zeit, mehrmals auf verschiedenen Geräten

                timerFound.oneOfMultiTimer = { value, sec, name: '', inputDevice: '' };
            } else {
                timerFound.oneOfMultiTimer = { value, sec: 0, name: '', inputDevice: '' };
            }
        }

        for (const timerIndex in timerObject.timer) {
            // Soll einer oder mehrere Timer gelöscht werden?
            if (deleteTimerIndex == 1) {
                // Einer, mit genauer Zeit, nur einmal vorhanden
                // Einer, und einer ist auch nur gestellt
                if (!store.questionAlexa) {
                    const voiceInputAsSeconds = timerObject.timer[timerIndex].getVoiceInputAsSeconds();
                    if (timerObject.timerActive.timerCount == 1 && timerObject.timerActive.timer[timerIndex]) {
                        timerFound.timer.push(timerIndex);
                        // _this.log.debug("Einer, wenn genau einer gestellt ist");
                    } else if (matchingTime == 1 && voiceInputAsSeconds == sec && sec !== 0) {
                        timerFound.timer.push(timerIndex);
                    } else if (
                        // _this.log.debug("Wenn nur einer gestellt ist mit der der gewünschten Zeit");
                        matchingTime == 1 &&
                        voiceInputAsSeconds == sec
                    ) {
                        timerFound.timer.push(timerIndex);
                        // _this.log.debug("Einer ist gestellt mit genau diesem Wert");
                    } else if (
                        // Einer, mit genauem Namen
                        timerObject.timer[timerIndex].getName() == name &&
                        name !== '' &&
                        matchingName == 1
                    ) {
                        timerFound.timer.push(timerIndex);
                    }
                }
            } else if (deleteTimerIndex == 2) {
                // Alle, alle sind auf einem Gerät
                if (!store.questionAlexa) {
                    timerFound.timer.push(timerIndex);
                    // }
                } else {
                    // Alle, nur die vom eingabe Gerät
                    if (matchingInputDevice != timerObject.timerActive.timerCount && value.indexOf('nein') != -1) {
                        if (timerObject.timer[timerIndex].getInputDevice() == inputDevice) {
                            timerFound.timer.push(timerIndex);
                            // _this.log.debug("Only this device");
                        }
                    } else if (
                        // Alle, von allen Geräten
                        matchingInputDevice != timerObject.timerActive.timerCount &&
                        value.indexOf('ja') != -1
                    ) {
                        for (const element in timerObject.timerActive.timer) {
                            timerFound.timer.push(element);
                            adapter.log.debug('Clear all');
                        }
                    }
                }
            }
        }
        return timerFound;
    } catch (e) {
        errorLogger('Error in findTimer', e);
        return { oneOfMultiTimer: {} as OneOfMultiTimer, timer: [] };
    }
};

function isSameInputDevice(timer: Timer, inputDevice: string): boolean {
    return timer.getInputDevice() === inputDevice;
}

function isSameName(timer: Timer, name: string): boolean {
    return timer.getName() == name;
}

function isSameSec(timer: Timer, sec: number): boolean {
    return timer.getVoiceInputAsSeconds() == sec;
}

function getMatchingTimerCounts(
    inputDevice: string,
    sec: number,
    name: string,
): { matchingName: number; matchingTime: number; matchingInputDevice: number } {
    let matchingTime = 0;
    let matchingName = 0;
    let matchingInputDevice = 0;

    for (const el in timerObject.timer) {
        const timer = timerObject.timer[el];

        matchingTime = isSameSec(timer, sec) ? matchingTime + 1 : matchingTime;
        matchingName = isSameName(timer, name) ? matchingName + 1 : matchingName;
        matchingInputDevice = isSameInputDevice(timer, inputDevice) ? matchingInputDevice + 1 : matchingInputDevice;
    }
    return {
        matchingName,
        matchingTime,
        matchingInputDevice,
    };
}
