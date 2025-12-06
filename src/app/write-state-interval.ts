import store from '@/store/store';
import { timerObject } from '@/config/timer-data';
import { writeState } from '@/app/write-state';
import { errorLogger } from '@/lib/logging';

export const writeStateIntervall = (): void => {
    const { adapter } = store;
    try {
        if (store.interval) {
            return;
        }
        store.interval = adapter.setInterval((): void => {
            writeState({ reset: false }).catch((e: any) => {
                errorLogger('Error in writeStateIntervall', e);
            });

            if (!Object.keys(timerObject.timer)?.find(t => timerObject.timer[t].isActive)) {
                adapter.setStateChanged('all_Timer.alive', false, true);
                adapter.clearInterval(store.interval);
                store.interval = null;
                adapter.log.debug('Intervall stopped!');
            }
        }, timerObject.timerActive.data.interval);
    } catch (e: any) {
        errorLogger('Error in writeStateIntervall', e);
        adapter.clearInterval(store.interval);
    }
};
