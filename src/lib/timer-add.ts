import { createStates } from '@/app/createStates';
import { timerObject } from '@/config/timer-data';

import store from '@/store/store';
import { Timer } from '@/app/timer';
import { isStringEmpty } from '@/lib/global';
import { errorLogger } from '@/lib/logging';
import { startTimer } from '@/lib/start-timer';
import { writeStateIntervall } from '@/app/write-state-interval';

function addNewRawTimer(timerIndex: string): void {
    timerObject.timerActive.timer[timerIndex] = false;

    timerObject.timer[timerIndex] = new Timer({
        store,
    });
}

export const timerAdd = (name: string, timerSec: number): void => {
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

            createStates(timerObject.timerActive.timerCount).catch((e: any) => {
                errorLogger('Error in timerAdd', e);
            });

            const timerIndex = `timer${timerObject.timerActive.timerCount}`;

            if (!timerObject.timerActive.timer[timerIndex]) {
                addNewRawTimer(timerIndex);
            }

            startTimer(timerSec, name).catch((e: any) => {
                errorLogger('Error in timerAdd', e);
            });

            writeStateIntervall();
        }
    }
};
