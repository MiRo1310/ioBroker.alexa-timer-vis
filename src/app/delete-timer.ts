import { timerObject } from '@/config/timer-data';
import { resetValues } from '@/app/reset';
import store from '@/store/store';
import { errorLogger } from '@/lib/logging';
import type { TimerIndex } from '@/types/types';

export const removeTimerInLastTimers = (): void => {
    store.lastTimer = { id: '', timerIndex: '', timerSerial: '' };
};

export const delTimer = (timer: TimerIndex): void => {
    resetValues(timerObject.timer[timer]).catch((e: any) => {
        errorLogger('Error in delTimer', e);
    });
    timerObject.timerActive.timer[timer] = false;
    removeTimerInLastTimers();
};
