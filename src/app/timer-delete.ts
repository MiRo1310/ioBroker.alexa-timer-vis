import store from '@/store/store';
import { findTimer } from '@/app/find-timer';
import { oneOfMultiTimerDelete } from '@/app/one-timer-to-delete';
import errorLogger from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import type { VoiceInput } from '@/app/voiceInput';

export const timerDelete = async (
    decomposeName: string,
    timerSec: number,
    voiceInput: VoiceInput,
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
                await timerObject.timer[element].reset();
            }
        } else if (result.oneOfMultiTimer) {
            const { sec, name, inputDevice } = result.oneOfMultiTimer;

            oneOfMultiTimerDelete(voiceInput, sec, name, inputDevice);
        }
    } catch (e: any) {
        errorLogger.send({
            title: 'Error in timerDelete',
            e,
            additionalInfos: [['VoiceInput', voiceInput.get()]],
        });
    }
};
