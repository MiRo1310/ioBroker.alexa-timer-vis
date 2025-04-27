import { useStore } from '../store/store';
import type { AlexaActiveTimerList, Timers, TimerSelector } from '../types/types';
import { isIobrokerValue } from './global';
import { timerObject } from '../config/timer-data';
import { errorLogger } from './logging';

export const getNewTimerName = (jsonString: ioBroker.State, timerSelector: string): void => {
    const { _this } = useStore();

    let json: AlexaActiveTimerList[] = [];
    try {
        if (isIobrokerValue(jsonString)) {
            json = JSON.parse(jsonString.val as string);
        }

        if (json.length === 1) {
            saveLabelAndId(json[0], timerSelector);
            return;
        }

        const timerWithUniqueId = getTimerWithUniqueId(json);
        if (timerWithUniqueId) {
            saveLabelAndId(timerWithUniqueId, timerSelector);
        }
    } catch (e: any) {
        errorLogger('Error in getNewTimerName', e, _this);
    }
};

export const registerIdToGetTimerName = async (timerSelector: TimerSelector): Promise<void> => {
    const store = useStore();
    const _this = store._this;
    try {
        const serial = store.deviceSerialNumber;
        if (!serial) {
            return;
        }
        const foreignId = `alexa2.${store.getAlexaInstanceObject().instance}.Echo-Devices.${serial}.Timer.activeTimerList`;
        store.lastTimer = { timerSerial: serial, timerSelector: timerSelector as string, id: foreignId };

        await _this.subscribeForeignStatesAsync(foreignId);
        _this.log.debug(`Subscribed to ${foreignId}`);
    } catch (e: any) {
        errorLogger('Error in registerIdToGetTimerName', e, _this);
    }
};

function getTimerWithUniqueId(json: AlexaActiveTimerList[]): AlexaActiveTimerList | null {
    let timerWithUniqueId: AlexaActiveTimerList | null = null;
    for (let i = 0; i < json.length; i++) {
        if (timerWithUniqueId) {
            break;
        }
        for (const timer in timerObject.timer) {
            if (timerObject.timer[timer as keyof Timers].id === json[i].id) {
                timerWithUniqueId = null;
                break;
            }
            timerWithUniqueId = { id: json[i].id, label: json[i].label || '', triggerTime: json[i].triggerTime };
        }
    }
    return timerWithUniqueId;
}

function saveLabelAndId({ id, label }: AlexaActiveTimerList, timerSelector: string): void {
    timerObject.timer[timerSelector as keyof typeof timerObject.timer].alexaTimerName = label || '';
    timerObject.timer[timerSelector as keyof typeof timerObject.timer].id = id || '';
}
