import errorLogger from '@/lib/logging';
import { timers } from '@/config/timer-data';
import { getTimerByIndex } from '@/app/timer';

export const timerDelete = async (id: string): Promise<void> => {
    try {
        for (const timerIndex in timers.timerList) {
            const timer = getTimerByIndex(timerIndex);

            if (timer && timer.getTimerId() === id) {
                await timer.reset();
            }
        }
    } catch (e: any) {
        errorLogger.send({ title: 'Error in timerDelete', e });
    }
};
