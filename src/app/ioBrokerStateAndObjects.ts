import type { TimerIndex } from '@/types/types';
import store from '@/app/store';
import { errorLogger } from '@/lib/logging';
import { createStates } from '@/app/createStates';
import { isIobrokerValue } from '@/lib/state';

export const setDeviceNameInObject = async (index: TimerIndex, val: string): Promise<void> => {
    const pathArray = [store.getAlexaTimerVisInstance(), index];
    const { adapter } = store;
    if (index === '') {
        return;
    }
    try {
        await new Promise<void>((resolve, reject) => {
            adapter.extendObject(
                pathArray.join('.'),
                {
                    type: 'device',
                    common: { name: val },
                    native: {},
                },
                err => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                },
            );
        });
    } catch (e: any) {
        errorLogger.send({ title: 'Error setDeviceNameInObject', e });
    }
};
export const initStateCreation = async (): Promise<void> => {
    const adapter = store.adapter;
    adapter.log.debug('Initializing Alexa Timer states');
    await adapter.setState('info.connection', true, true);

    await createStates(4);
};

export const isAlexaTimerVisResetButton = (state: ioBroker.State | null | undefined, id: string): boolean =>
    isIobrokerValue(state) && id.includes('.Reset');

export const getIndexFromId = (id: string): string => id.split('.')?.[2] ?? '';
