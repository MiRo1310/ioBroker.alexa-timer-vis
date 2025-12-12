import { createStates } from '@/app/createStates';
import { timerObject } from '@/config/timer-data';

import store from '@/store/store';
import { Timer } from '@/app/timer';
import errorLogger from '@/lib/logging';
import { startTimer } from '@/app/timer-start';
import { writeStateInterval } from '@/app/write-state-interval';
import { isStringEmpty } from '@/lib/string';

function addNewRawTimer(timerIndex: string): void {
    timerObject.timerActive.timer[timerIndex] = false;

    timerObject.timer[timerIndex] = new Timer({
        store,
    });
}

export const timerAdd = async (name: string, timerSec: number): Promise<void> => {
    try {
        if (timerSec && timerSec != 0) {
            let nameExist = false;

            for (const element in timerObject.timer) {
                if (timerObject.timer[element].getName() == name && !isStringEmpty(name)) {
                    nameExist = true;
                    //FIXME: Break evtl entfernen
                    break;
                }
            }

            if (!nameExist) {
                timerObject.timerActive.timerCount++;

                await createStates(timerObject.timerActive.timerCount);

                const timerIndex = `timer${timerObject.timerActive.timerCount}`;

                if (!timerObject.timerActive.timer[timerIndex]) {
                    addNewRawTimer(timerIndex);
                }

                await startTimer(timerSec, name);

                writeStateInterval();
            }
        }
    } catch (e: any) {
        errorLogger.send({ title: 'Error timerAdd', e });
    }
};
