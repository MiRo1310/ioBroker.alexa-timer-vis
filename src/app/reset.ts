import store from '@/store/store';
import { timerObject } from '@/config/timer-data';
import type { Timer } from '@/app/timer';
import { writeStates } from '@/app/write-state';
import { setDeviceNameInObject } from '@/app/ioBrokerStateAndObjects';

export const resetTimer = async (timer: Timer): Promise<void> => {
    const index = timer.getTimerIndex();
    if (!index) {
        return;
    }
    timer.reset();
    await setDeviceNameInObject(index, '');
};

export async function resetAllTimerValuesAndStateValues(): Promise<void> {
    for (const timerIndex in timerObject.timer) {
        await resetTimer(timerObject.timer[timerIndex]);

        await writeStates({ reset: true });
    }
    store.adapter.setStateChanged('all_Timer.alive', false, true);
}
