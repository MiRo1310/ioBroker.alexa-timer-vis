import store from '@/store/store';
import { timerObject } from '@/config/timer-data';
import { writeStates } from '@/app/write-state';
import { errorLogger } from '@/lib/logging';

/**
 * Starts an interval to periodically write the state of all active timers.
 */
export const writeStateInterval = (): void => {
    const { adapter } = store;
    try {
        if (store.interval) {
            return;
        }
        store.interval = adapter.setInterval((): void => {
            writeStates({ reset: false }).catch((e: any) => {
                errorLogger('Error in writeStateInterval', e, null);
            });

            if (!Object.keys(timerObject.timer)?.find(t => timerObject.timer[t].isActive)) {
                adapter.setStateChanged('all_Timer.alive', false, true);
                adapter.clearInterval(store.interval);
                store.interval = null;

                adapter.log.debug('Interval stopped!');
            }
        }, timerObject.timerActive.data.interval);
    } catch (e: any) {
        errorLogger('Error in writeStateInterval', e, null);
        adapter.clearInterval(store.interval);
    }
};
