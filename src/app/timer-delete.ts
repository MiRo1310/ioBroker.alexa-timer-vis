import errorLogger from '@/lib/logging';
import { timers } from '@/config/timer-data';
import { getTimerByIndex } from '@/app/timer';
import store from '@/store/store';

export const timerDelete = async (id: string): Promise<void> => {
    try {
        for (const timerIndex in timers.timerList) {
            const timer = getTimerByIndex(timerIndex);

            if (timer && timer.getTimerId() === id) {
                //TODO remove log
                store.adapter.log.debug(`Reset timer in timerDelete ${timerIndex}`);
                await timer.reset();
            }
        }
    } catch (e: any) {
        errorLogger.send({ title: 'Error in timerDelete', e });
    }
};
