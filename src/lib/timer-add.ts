import { startTimer } from './start-timer';
import { createStates } from '../app/createStates';
import { timerObject } from '@/config/timer-data';
import { writeStateIntervall } from '../app/write-state-interval';
import { isStringEmpty } from './global';
import { errorLogger } from './logging';
import { useStore } from '@/store/store';
import { Timer } from '@/app/timer';

function addNewRawTimer(timerIndex: string): void {
    timerObject.timerActive.timer[timerIndex] = false;

    timerObject.timer[timerIndex] = new Timer({
        store: useStore(),
    });
}

export const timerAdd = (name: string, timerSec: number): void => {
    const { _this } = useStore();

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
                errorLogger('Error in timerAdd', e, _this);
            });

            const timerIndex = `timer${timerObject.timerActive.timerCount}`;

            if (!timerObject.timerActive.timer[timerIndex]) {
                addNewRawTimer(timerIndex);
            }

            startTimer(timerSec, name).catch((e: any) => {
                errorLogger('Error in timerAdd', e, _this);
            });

            writeStateIntervall();
        }
    }
};
