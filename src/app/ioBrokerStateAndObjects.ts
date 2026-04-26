import type { AlexaJson, TimerIndex } from '@/types/types';
import store from '@/app/store';
import { errorLogger } from '@/lib/logging';
import { isString } from '@/lib/string';
import { createStates } from '@/app/createStates';
import { isIobrokerValue } from '@/lib/state';

export const setDeviceNameInObject = async (index: TimerIndex, val: string): Promise<void> => {
    const pathArray = [store.getAlexaTimerVisInstance(), index];
    const { adapter } = store;
    if (index === '') {
        return;
    }
    try {
        await adapter.setObject(pathArray.join('.'), {
            type: 'device',
            common: { name: val },
            native: {},
        });
    } catch (e: any) {
        errorLogger.send({ title: 'Error setDeviceNameInObject', e });
    }
};

export async function getParsedAlexaJson(): Promise<AlexaJson | undefined> {
    try {
        const instance = store.getAlexa2Instance();
        if (!instance) {
            return;
        }
        const jsonAlexa = await store.adapter.getForeignStateAsync(`alexa2.${instance}.History.json`);

        if (isString(jsonAlexa?.val)) {
            return JSON.parse(jsonAlexa.val);
        }
    } catch (e) {
        errorLogger.send({ title: 'Error in getParsedAlexaJson', e });
    }
}

export const initStateCreation = async (): Promise<void> => {
    const adapter = store.adapter;
    adapter.log.info('Alexa State was found');
    await adapter.setState('info.connection', true, true);

    await createStates(4);
};

export const isAlexaTimerVisResetButton = (state: ioBroker.State | null | undefined, id: string): boolean =>
    isIobrokerValue(state) && id.includes('.Reset');

export const getIndexFromId = (id: string): string => id.split('.')?.[2] ?? '';
