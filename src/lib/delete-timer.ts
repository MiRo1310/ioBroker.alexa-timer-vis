import { timerObject } from '../config/timer-data';
import { resetValues } from './reset';
import { useStore } from '../store/store';
import { errorLogger } from './logging';

export const removeTimerInLastTimers = (): void => {
    const store = useStore();
    store.lastTimer = { id: '', timerSelector: '', timerSerial: '' };
};
export const delTimer = (timer: keyof typeof timerObject.timerActive.timer): void => {
    resetValues(timerObject.timer[timer], timer).catch((e: any) => {
        errorLogger('Error in delTimer', e, useStore()._this);
    });
    timerObject.timerActive.timer[timer] = false;
    removeTimerInLastTimers();
};
