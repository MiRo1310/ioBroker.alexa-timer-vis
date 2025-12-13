import store from '@/store/store';
import errorLogger from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import type { VoiceInput } from '@/app/voiceInput';
import { getActiveAlexaTimerListForDevice } from '@/app/ioBrokerStateAndObjects';
import { getTimerByIndex } from '@/app/timer';

export const timerDelete = async (voiceInput: VoiceInput): Promise<void> => {
    try {
        const { adapter } = store;
        const alexaInstance = store.getAlexa2Instance();

        const serialState = await adapter.getForeignStateAsync(`alexa2.${alexaInstance}.History.serialNumber`);
        if (!serialState?.val) {
            //TODO Output das keine serial gefunden wurde
            return;
        }
        const activeTimerList = await getActiveAlexaTimerListForDevice(String(serialState.val));
        if (!activeTimerList) {
            //TODO
            return;
        }
        const id = store.getRemovedTimerId(activeTimerList);

        if (id) {
            for (const timerIndex in timerObject.timer) {
                const timer = getTimerByIndex(timerIndex);

                if (timer && timer.getTimerId() === id) {
                    await timer.reset();
                }
            }
        }
    } catch (e: any) {
        errorLogger.send({
            title: 'Error in timerDelete',
            e,
            additionalInfos: [['VoiceInput', voiceInput.get()]],
        });
    }
};
