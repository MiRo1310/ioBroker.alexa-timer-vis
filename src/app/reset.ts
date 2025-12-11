import store from '@/store/store';
import { timerObject } from '@/config/timer-data';
import { writeStates } from '@/app/write-state';

export async function resetAllTimerValuesAndStateValues(): Promise<void> {
    for (const timerIndex in timerObject.timer) {
        const timer = timerObject.timer[timerIndex];

        await timer.reset();

        await writeStates({ reset: true });
    }
    store.adapter.setStateChanged('all_Timer.alive', false, true);
}
