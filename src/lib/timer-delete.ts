import { delTimer } from './delete-timer';
import { findTimer } from './find-timer';
import { oneOfMultiTimerDelete } from './one-timer-to-delete';
import { useStore } from '../store/store';
import { errorLogging } from './logging';

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

    await findTimer(timerAbortSec, name, deleteTimerIndex, voiceInput).then((timers: any) => {
        try {
            if (timers.timer) {
                timers.timer.forEach((element: any) => {
                    delTimer(element);
                });
            } else if (timers.oneOfMultiTimer) {
                const a = timers.oneOfMultiTimer;
                if (
                    typeof a[0] == 'string' &&
                    typeof a[1] == 'number' &&
                    typeof a[2] == 'string' &&
                    typeof a[3] == 'string'
                ) {
                    oneOfMultiTimerDelete(a[0], a[1], a[2], a[3]);
                }
            }
        } catch (e: any) {
            errorLogging({ text: 'Error in timerDelete', error: e, _this });
        }
    });
};
