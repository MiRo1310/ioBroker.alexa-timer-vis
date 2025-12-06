import store from '@/store/store';
import { errorLogger } from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import type { Timer } from '@/app/timer';
import { writeState } from '@/app/write-state';

export const resetValues = async (timer: Timer): Promise<void> => {
    const { adapter } = store;
    const index = timer.getTimerIndex();
    if (!index) {
        return;
    }
    try {
        timer.reset();
        adapter.log.debug(JSON.stringify(timerObject.timerActive));

        await adapter.setObject(store.getAlexaTimerVisInstance() + index, {
            type: 'device',
            common: { name: `` },
            native: {},
        });
    } catch (e: any) {
        errorLogger('Error in resetValues', e);
    }
};

export function resetAllTimerValuesAndState(): void {
    Object.keys(timerObject.timer).forEach(el => {
        resetValues(timerObject.timer[el]).catch(e => {
            errorLogger('Error in resetAllTimerValuesAndState', e);
        });

        writeState({ reset: true }).catch(e => {
            errorLogger('Error in resetAllTimerValuesAndState', e);
        });
    });
    store.adapter.setStateChanged('all_Timer.alive', false, true);
}
