import store from '@/store/store';
import { timers } from '@/config/timer-data';
import { writeStates } from '@/app/write-state';
import errorLogger from '@/lib/logging';

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
                errorLogger.send({ title: 'Error writeStateIntervall', e });
            });

            if (!Object.keys(timers.timerList)?.find(t => timers.timerList[t].isActive)) {
                adapter.setStateChanged('all_Timer.alive', false, true);
                adapter.clearInterval(store.interval);

                store.interval = null;
                adapter.log.debug('Interval stopped!');
            }
        }, timers.intervalTime);
    } catch (e: any) {
        errorLogger.send({ title: 'Error writeStateIntervall', e });

        adapter.clearInterval(store.interval);
    }
};
