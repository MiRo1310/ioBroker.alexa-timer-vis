import store from '@/app/store';
import { writeStates } from '@/app/write-state';

export async function resetAllTimerValuesAndStateValues(): Promise<void> {
    await writeStates({ reset: true });
    store.adapter.setStateChanged('all_Timer.alive', false, true);
}
