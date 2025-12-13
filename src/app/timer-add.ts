import { createStates } from '@/app/createStates';
import { timerObject } from '@/config/timer-data';

import store from '@/store/store';
import { Timer } from '@/app/timer';
import errorLogger from '@/lib/logging';
import { startTimer } from '@/app/timer-start';
import { writeStateInterval } from '@/app/write-state-interval';

function addNewRawTimer(timerIndex: string): void {
    timerObject.timerActive.timer[timerIndex] = false;

    timerObject.timer[timerIndex] = new Timer({
        store,
    });
}

export const timerAdd = async (): Promise<void> => {
    try {
        timerObject.timerActive.timerCount++;

        await createStates(timerObject.timerActive.timerCount);

        const timerIndex = `timer${timerObject.timerActive.timerCount}`;

        if (!timerObject.timerActive.timer[timerIndex]) {
            addNewRawTimer(timerIndex);
        }

        await startTimer();

        writeStateInterval();
    } catch (e: any) {
        errorLogger.send({ title: 'Error timerAdd', e });
    }
};
