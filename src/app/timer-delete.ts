import errorLogger from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import { getTimerByIndex } from '@/app/timer';

export const timerDelete = async (id: string): Promise<void> => {
    try {
        for (const timerIndex in timerObject.timer) {
            const timer = getTimerByIndex(timerIndex);

            if (timer && timer.getTimerId() === id) {
                await timer.reset();
            }
        }
    } catch (e: any) {
        errorLogger.send({ title: 'Error in timerDelete', e });
    }
};
