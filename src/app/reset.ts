import store from '@/store/store';
import { errorLogger } from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import type { Timer } from '@/app/timer';
import { writeState } from '@/app/write-state';
import { setDeviceNameInObject } from '@/app/iobrokerObjects';

export const resetTimer = async (timer: Timer): Promise<void> => {
    const index = timer.getTimerIndex();
    if (!index) {
        return;
    }
    timer.reset();
    await setDeviceNameInObject(index, '');
};

export function resetAllTimerValuesAndState(): void {
    Object.keys(timerObject.timer).forEach(el => {
        resetTimer(timerObject.timer[el]).catch(e => {
            errorLogger('Error in resetAllTimerValuesAndState', e);
        });

        writeState({ reset: true }).catch(e => {
            errorLogger('Error in resetAllTimerValuesAndState', e);
        });
    });
    store.adapter.setStateChanged('all_Timer.alive', false, true);
}
