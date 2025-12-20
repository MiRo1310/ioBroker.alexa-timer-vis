import store from '@/store/store';
import { obj } from '@/config/timer-data';
import { writeStates } from '@/app/write-state';
import { errorLogger } from '@/lib/logging';

/**
 * Starts an interval to periodically write the state of all active timers.
 */
export const writeStateInterval = (): void => {
    const { adapter } = store;

    if (store.writeStateInterval) {
        return;
    }
    store.writeStateInterval = adapter.setInterval((): void => {
        writeStates({ reset: false }).catch((e: any) => {
            errorLogger.send({ title: 'Error writeStateIntervall', e });
        });

        if (!store.isSomeTimerRunning()) {
            stopWriteStateInterval();
        }
    }, obj.intervalTime);
};

function stopWriteStateInterval(): void {
    const { adapter } = store;
    adapter.setStateChanged('all_Timer.alive', false, true);
    adapter.clearInterval(store.writeStateInterval);

    store.writeStateInterval = null;
    adapter.log.debug('Write States Interval stopped!');
}
