import store from '@/store/store';
import errorLogger from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import { getActiveAlexaTimerListForDevice } from '@/app/ioBrokerStateAndObjects';
import { getTimerByIndex } from '@/app/timer';
import type { AlexaActiveTimerList } from '@/types/types';

export const getActiveAlexaTimerList = async (): Promise<AlexaActiveTimerList[]> => {
    const { adapter } = store;
    const alexaInstance = store.getAlexa2Instance();

    const serialState = await adapter.getForeignStateAsync(`alexa2.${alexaInstance}.History.serialNumber`);
    if (!serialState?.val) {
        const title = 'Cannot find serial';
        errorLogger.send({ title, e: null, level: 'warning' });
        return [];
    }
    return (await getActiveAlexaTimerListForDevice(String(serialState.val))) ?? [];
};

export const timerDelete = async (): Promise<void> => {
    try {
        const activeTimerList = await getActiveAlexaTimerList();
        const id = store.getRemovedTimerId(activeTimerList);

        if (!id) {
            return;
        }
        for (const timerIndex in timerObject.timer) {
            const timer = getTimerByIndex(timerIndex);

            if (timer && timer.getTimerId() === id) {
                await timer.reset();
            }
        }
    } catch (e: any) {
        errorLogger.send({ title: 'Error in timerDelete', e });
    }
};
