import { createStates } from '@/app/createStates';
import { timers } from '@/config/timer-data';

import store from '@/store/store';
import { getTimerByIndex, Timer } from '@/app/timer';
import errorLogger from '@/lib/logging';
import { startTimer } from '@/app/timer-start';
import { writeStateInterval } from '@/app/write-state-interval';
import type { AlexaActiveTimerList } from '@/types/types';

function addNewRawTimer(timerIndex: string): void {
    store.adapter.log.debug(`add index ${timerIndex}`);
    timers.status[timerIndex] = false;

    timers.timerList[timerIndex] = new Timer({
        store,
    });
}

export const timerAdd = async (newActiveTimer: AlexaActiveTimerList): Promise<void> => {
    try {
        timers.count.increment();
        const timerCount = timers.count.getCount();
        await createStates(timerCount);

        const timerIndex = `timer${timerCount}`;

        if (!getTimerByIndex(timerIndex)) {
            addNewRawTimer(timerIndex);
        }

        await startTimer(newActiveTimer);

        writeStateInterval();
    } catch (e: any) {
        errorLogger.send({ title: 'Error timerAdd', e });
    }
};
