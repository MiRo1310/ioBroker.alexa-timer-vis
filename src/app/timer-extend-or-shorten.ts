import errorLogger from '@/lib/logging';
import store from '@/store/store';
import { getTimerById } from '@/app/timer';
import { getActiveAlexaTimerList } from '@/app/timer-delete';

export const extendOrShortTimer = async (): Promise<void> => {
    try {
        const activeTimerList = await getActiveAlexaTimerList();
        const activeTimerWithDifferentTriggerTime = store.getActiveTimerWithDifferentTriggerTime(activeTimerList);

        if (!activeTimerWithDifferentTriggerTime) {
            return;
        }

        const timer = getTimerById(activeTimerWithDifferentTriggerTime.listEl.id);
        if (timer) {
            timer.extendTimer(activeTimerWithDifferentTriggerTime.changedSec);
        }
    } catch (e: any) {
        errorLogger.send({ title: 'Error in extendOrShortenTimer', e });
    }
};
