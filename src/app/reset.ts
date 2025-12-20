import store from '@/store/store';
import { obj } from '@/config/timer-data';
import { writeStates } from '@/app/write-state';

export async function resetAllTimerValuesAndStateValues(): Promise<void> {
    for (const timerIndex in obj.timers) {
        const timer = obj.timers[timerIndex];

        await timer.reset();

        await writeStates({ reset: true });
    }
    store.adapter.setStateChanged('all_Timer.alive', false, true);
}
