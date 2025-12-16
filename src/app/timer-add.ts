import { createStates } from '@/app/createStates';
import { timerObject } from '@/config/timer-data';

import store from '@/store/store';
import { getTimerByIndex, Timer } from '@/app/timer';
import errorLogger from '@/lib/logging';
import { startTimer } from '@/app/timer-start';
import { writeStateInterval } from '@/app/write-state-interval';

function addNewRawTimer(timerIndex: string): void {
    store.adapter.log.debug(`add index ${timerIndex}`);
    timerObject.timerStatus[timerIndex] = false;

    timerObject.timer[timerIndex] = new Timer({
        store,
    });
}

export const timerAdd = async (): Promise<void> => {
    try {
        timerObject.timerCount.increment();
        const timerCount = timerObject.timerCount.getCount();
        await createStates(timerCount);

        const timerIndex = `timer${timerCount}`;

        if (!getTimerByIndex(timerIndex)) {
            addNewRawTimer(timerIndex);
        }

        await startTimer();

        writeStateInterval();
    } catch (e: any) {
        errorLogger.send({ title: 'Error timerAdd', e });
    }
};
