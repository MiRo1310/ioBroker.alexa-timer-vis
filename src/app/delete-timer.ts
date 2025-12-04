import { timerObject } from '@/config/timer-data';
import { resetValues } from '@/app/reset';

import { errorLogger } from '@/lib/logging';
import type { TimerIndex } from '@/types/types';

export const delTimer = (timer: TimerIndex): void => {
    resetValues(timerObject.timer[timer]).catch((e: any) => {
        errorLogger('Error in delTimer', e);
    });
    timerObject.timerActive.timer[timer] = false;
};
