import store from '@/store/store';
import errorLogger from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import { getActiveAlexaTimerListForDevice } from '@/app/ioBrokerStateAndObjects';
import { getTimerByIndex } from '@/app/timer';
import type { AlexaActiveTimerList } from '@/types/types';

export const getActiveAlexaTimerList = async (serial?: string): Promise<AlexaActiveTimerList[]> => {
    let serialNumber = serial;
    if (!serialNumber) {
        const { adapter } = store;
        const alexaInstance = store.getAlexa2Instance();

        const serialState = await adapter.getForeignStateAsync(`alexa2.${alexaInstance}.History.serialNumber`);
        if (!serialState?.val) {
            const title = 'Cannot find serial';
            errorLogger.send({ title, e: null, level: 'warning' });
            return [];
        }
        serialNumber = String(serialState.val);
    }
    return (await getActiveAlexaTimerListForDevice(serialNumber, true)) ?? [];
};

export const timerDelete = async (): Promise<void> => {
    try {
        for (const el of store.getLocalActiveTimerList()) {
            const activeTimerList = await getActiveAlexaTimerList(el.deviceSerialNumber);
            const id = store.getRemovedTimerId(activeTimerList);

            if (!id) {
                continue;
            }
            for (const timerIndex in timerObject.timer) {
                const timer = getTimerByIndex(timerIndex);

                if (timer && timer.getTimerId() === id) {
                    await timer.reset();
                }
            }
        }
    } catch (e: any) {
        errorLogger.send({ title: 'Error in timerDelete', e });
    }
};
