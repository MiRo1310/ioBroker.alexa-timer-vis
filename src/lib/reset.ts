import type AlexaTimerVis from '../main';
import { useStore } from '../store/store';
import { errorLogger } from './logging';
import type { TimerIndex } from '../types/types';

import { timerObject } from '../config/timer-data';
import { writeState } from './write-state';
import type { Timer } from '../app/timer';

export const resetValues = async (timer: Timer, index: TimerIndex): Promise<void> => {
    const { _this, getAlexaTimerVisInstance } = useStore();

    try {
        timerObject.timerActive.timer[index] = false; // Timer auf false setzen falls Zeit abgelaufen ist, ansonsten steht er schon auf false
        _this.log.debug(JSON.stringify(timerObject.timerActive));
        timer.reset();

        await _this.setObject(getAlexaTimerVisInstance() + index, {
            type: 'device',
            common: { name: `` },
            native: {},
        });
    } catch (e: any) {
        errorLogger('Error in resetValues', e, _this);
    }
};

export function resetAllTimerValuesAndState(_this: AlexaTimerVis): void {
    Object.keys(timerObject.timer).forEach(el => {
        resetValues(timerObject.timer[el], el).catch(e => {
            errorLogger('Error in resetAllTimerValuesAndState', e, _this);
        });

        writeState({ reset: true }).catch(e => {
            errorLogger('Error in resetAllTimerValuesAndState', e, _this);
        });
    });
    _this.setStateChanged('all_Timer.alive', false, true);
}
