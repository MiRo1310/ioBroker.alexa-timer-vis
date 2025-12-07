import store from '@/store/store';
import { findTimer } from '@/app/find-timer';
import { oneOfMultiTimerDelete } from '@/app/one-timer-to-delete';
import { errorLogger } from '@/lib/logging';
import { resetTimer } from '@/app/reset';
import { timerObject } from '@/config/timer-data';

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
    try {
        const result = await findTimer(timerAbortSec, name, deleteTimerIndex, voiceInput);

        if (result.timer.length) {
            for (const element of result.timer) {
                await resetTimer(timerObject.timer[element]);
            }
        } else if (result.oneOfMultiTimer) {
            const { value, sec, name, inputDevice } = result.oneOfMultiTimer;

            oneOfMultiTimerDelete(value, sec, name, inputDevice);
        }
    } catch (e: any) {
        errorLogger('Error in timerDelete', e);
    }
};
