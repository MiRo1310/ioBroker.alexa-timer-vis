import { useStore } from '../store/store';
import { timerObject } from '../config/timer-data';
import { isIobrokerValue, isString } from './global';
import { errorLogger } from './logging';
import type { OneOfMultiTimer, TimerIndex } from '../types/types';

export const findTimer = async (
    sec: number,
    name: string,
    deleteTimerIndex: number,
    value: string,
): Promise<{ oneOfMultiTimer: OneOfMultiTimer; timer: TimerIndex[] }> => {
    const store = useStore();
    const _this = store._this;
    try {
        name = name.trim();
        let inputDevice = '';

        const obj = await _this.getForeignStateAsync(`alexa2.${store.getAlexaInstanceObject().instance}.History.name`);

        if (isIobrokerValue(obj) && isString(obj.val)) {
            inputDevice = obj.val;
        }

        const { countMatchingName, countMatchingTime, countMatchingInputDevice } = getMatchingTimerCounts(
            inputDevice,
            sec,
            name,
        );

        const timerFound: {
            oneOfMultiTimer: OneOfMultiTimer;
            timer: TimerIndex[];
        } = { oneOfMultiTimer: {} as OneOfMultiTimer, timer: [] };

        if (store.questionAlexa) {
            if (countMatchingName == 1) {
                timerFound.oneOfMultiTimer = { value: '', sec: 0, name, inputDevice };
            } else if (countMatchingTime > 1) {
                // Einer, mit genauer Zeit, mehrmals vorhanden
                timerFound.oneOfMultiTimer = { value, sec, name: '', inputDevice: '' };
            } else if (countMatchingInputDevice != timerObject.timerActive.timerCount) {
                // Einer, mit genauer Zeit, mehrmals auf verschiedenen Geräten

                timerFound.oneOfMultiTimer = { value, sec, name: '', inputDevice: '' };
            } else {
                timerFound.oneOfMultiTimer = { value, sec: 0, name: '', inputDevice: '' };
            }
        }

        for (const element in timerObject.timer) {
            const timerName = element;
            // Soll einer oder mehrere Timer gelöscht werden?
            if (deleteTimerIndex == 1) {
                // Einer, mit genauer Zeit, nur einmal vorhanden
                // Einer, und einer ist auch nur gestellt
                if (!store.questionAlexa) {
                    const voiceInputAsSeconds = timerObject.timer[timerName].getVoiceInputAsSeconds();
                    if (timerObject.timerActive.timerCount == 1 && timerObject.timerActive.timer[timerName]) {
                        timerFound.timer.push(timerName);
                        // _this.log.debug("Einer, wenn genau einer gestellt ist");
                    } else if (countMatchingTime == 1 && voiceInputAsSeconds == sec && sec !== 0) {
                        timerFound.timer.push(timerName);
                    } else if (
                        // _this.log.debug("Wenn nur einer gestellt ist mit der der gewünschten Zeit");
                        countMatchingTime == 1 &&
                        voiceInputAsSeconds == sec
                    ) {
                        timerFound.timer.push(timerName);
                        // _this.log.debug("Einer ist gestellt mit genau diesem Wert");
                    } else if (
                        // Einer, mit genauem Namen
                        timerObject.timer[timerName].getName() == name &&
                        name !== '' &&
                        countMatchingName == 1
                    ) {
                        timerFound.timer.push(timerName);

                        // _this.log.debug("Mit genauem Namen");
                    } // Entweder alle auf diesem Gerät, oder keins auf diesem Gerät
                    // }
                }
            } else if (deleteTimerIndex == 2) {
                // Alle, alle sind auf einem Gerät
                if (!store.questionAlexa) {
                    timerFound.timer.push(timerName);
                    // }
                } else {
                    // Alle, nur die vom eingabe Gerät
                    if (countMatchingInputDevice != timerObject.timerActive.timerCount && value.indexOf('nein') != -1) {
                        if (timerObject.timer[timerName].getInputDevice() == inputDevice) {
                            timerFound.timer.push(timerName);
                            // _this.log.debug("Only this device");
                        }
                    } else if (
                        // Alle, von allen Geräten
                        countMatchingInputDevice != timerObject.timerActive.timerCount &&
                        value.indexOf('ja') != -1
                    ) {
                        for (const element in timerObject.timerActive.timer) {
                            timerFound.timer.push(element);
                            _this.log.debug('Clear all');
                        }
                    }
                }
            }
        }
        return timerFound;
    } catch (e) {
        errorLogger('Error in findTimer', e, _this);
        return { oneOfMultiTimer: {} as OneOfMultiTimer, timer: [] };
    }
};

function findTimerWithExactSameInputDevice(
    timerName: TimerIndex,
    inputDevice: string,
    countMatchingInputDevice: number,
): number {
    if (timerObject.timer[timerName].getInputDevice() === inputDevice) {
        countMatchingInputDevice++;
    }
    return countMatchingInputDevice;
}

function findTimerWithExactSameName(timerName: TimerIndex, countMatchingName: number, name: string): number {
    if (timerObject.timer[timerName].getName() == name) {
        countMatchingName++;
    }
    return countMatchingName;
}

function findTimerWithExactSameSec(element: TimerIndex, countMatchingTime: number, sec: number): number {
    if (timerObject.timer[element].getVoiceInputAsSeconds() == sec) {
        countMatchingTime++;
    }
    return countMatchingTime;
}

function getMatchingTimerCounts(
    inputDevice: string,
    sec: number,
    name: string,
): { countMatchingName: number; countMatchingTime: number; countMatchingInputDevice: number } {
    let countMatchingTime = 0;
    let countMatchingName = 0;
    let countMatchingInputDevice = 0;

    for (const el in timerObject.timer) {
        const element = el;
        countMatchingTime = findTimerWithExactSameSec(element, countMatchingTime, sec);
        countMatchingName = findTimerWithExactSameName(element, countMatchingName, name);
        countMatchingInputDevice = findTimerWithExactSameInputDevice(element, inputDevice, countMatchingInputDevice);
    }
    return { countMatchingName, countMatchingTime, countMatchingInputDevice };
}
