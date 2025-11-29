import { useStore } from '../store/store';
import type { AlexaActiveTimerList, Timers } from '../types/types';
import { isIobrokerValue } from './global';
import { timerObject } from '../config/timer-data';
import { errorLogger } from './logging';
import type { Timer } from '../app/timer';

export const getNewTimerName = (jsonString: ioBroker.State, timerSelector: keyof Timers): void => {
    const { _this } = useStore();

    let json: AlexaActiveTimerList[] = [];
    try {
        if (isIobrokerValue(jsonString)) {
            json = JSON.parse(jsonString.val as string);
        }
        const timer = timerObject.timer[timerSelector];
        if (json.length === 1) {
            saveLabelAndId(json[0], timer);
            return;
        }

        const timerWithUniqueId = getTimerWithUniqueId(json);
        if (timerWithUniqueId) {
            saveLabelAndId(timerWithUniqueId, timer);
        }
    } catch (e: any) {
        errorLogger('Error in getNewTimerName', e, _this);
    }
};

function getTimerWithUniqueId(json: AlexaActiveTimerList[]): AlexaActiveTimerList | null {
    let timerWithUniqueId: AlexaActiveTimerList | null = null;
    for (let i = 0; i < json.length; i++) {
        if (timerWithUniqueId) {
            break;
        }
        for (const timer in timerObject.timer) {
            if (timerObject.timer[timer].getId() === json[i].id) {
                timerWithUniqueId = null;
                break;
            }
            timerWithUniqueId = { id: json[i].id, label: json[i].label || '', triggerTime: json[i].triggerTime };
        }
    }
    return timerWithUniqueId;
}

function saveLabelAndId({ id, label }: AlexaActiveTimerList, timer: Timer): void {
    timer.setId(id);
    timer.setAlexaTimerName(label ?? '');
}
