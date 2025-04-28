import { delTimer } from './delete-timer';
import { findTimer } from './find-timer';
import { oneOfMultiTimerDelete } from './one-timer-to-delete';
import { useStore } from '../store/store';
import { errorLogger } from './logging';

export const timerDelete = async (
    decomposeName: string,
    timerSec: number,
    voiceInput: string,
    deleteVal: number,
): Promise<void> => {
    const store = useStore();
    const _this = store._this;
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

        _this.log.debug('Timer can be deleted');
    }

    await findTimer(timerAbortSec, name, deleteTimerIndex, voiceInput).then(timers => {
        try {
            if (timers.timer) {
                timers.timer.forEach(element => {
                    delTimer(element);
                });
            } else if (timers.oneOfMultiTimer) {
                const { value, sec, name, inputDevice } = timers.oneOfMultiTimer;

                oneOfMultiTimerDelete(value, sec, name, inputDevice);
            }
        } catch (e: any) {
            errorLogger('Error in timerDelete', e, _this);
        }
    });
};
