import { delTimer } from '@/app/delete-timer';
import store from '@/store/store';
import { findTimer } from '@/lib/find-timer';
import { oneOfMultiTimerDelete } from '@/lib/one-timer-to-delete';
import { errorLogger } from '@/lib/logging';

export const timerDelete = async (
    decomposeName: string,
    timerSec: number,
    voiceInput: string,
    deleteVal: number,
): Promise<void> => {
    let name = decomposeName;
    let timerAbortSec = 0;
    if (timerSec) {
        timerAbortSec = timerSec;
    }

    let deleteTimerIndex = 0;

    if (store.questionAlexa) {
        deleteTimerIndex = 1;
        name = '';
    } else {
        if (deleteVal) {
            deleteTimerIndex = deleteVal;
        }

        store.adapter.log.debug('Timer can be deleted');
    }

    await findTimer(timerAbortSec, name, deleteTimerIndex, voiceInput).then(timers => {
        try {
            if (timers.timer.length) {
                timers.timer.forEach(element => {
                    delTimer(element);
                });
            } else if (timers.oneOfMultiTimer) {
                const { value, sec, name, inputDevice } = timers.oneOfMultiTimer;

                oneOfMultiTimerDelete(value, sec, name, inputDevice);
            }
        } catch (e: any) {
            errorLogger('Error in timerDelete', e);
        }
    });
};
