import store from '@/store/store';
import { timers } from '@/config/timer-data';
import { writeStates } from '@/app/write-state';

export async function resetAllTimerValuesAndStateValues(): Promise<void> {
    for (const timerIndex in timers.timerList) {
        const timer = timers.timerList[timerIndex];

        await timer.reset();

        await writeStates({ reset: true });
    }
    store.adapter.setStateChanged('all_Timer.alive', false, true);
}
