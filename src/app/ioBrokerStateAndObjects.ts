import type { AlexaJson, TimerIndex } from '@/types/types';
import store from '@/store/store';
import { errorLogger } from '@/lib/logging';
import { isString } from '@/lib/string';
import { createStates } from '@/app/createStates';
import { isIobrokerValue } from '@/lib/state';

export const setDeviceNameInObject = async (index: TimerIndex, val: string): Promise<void> => {
    const pathArray = [store.getAlexaTimerVisInstance(), index];
    const { adapter } = store;
    try {
        await adapter.setObject(pathArray.join('.'), {
            type: 'device',
            common: { name: val },
            native: {},
        });
    } catch (e: any) {
        errorLogger('Error setDeviceNameInObject', e);
    }
};

export async function getParsedAlexaJson(): Promise<AlexaJson | undefined> {
    try {
        const instance = store.getAlexaInstanceObject().instance;
        const jsonAlexa = await store.adapter.getForeignStateAsync(`alexa2.${instance}.History.json`);
        if (isString(jsonAlexa?.val)) {
            return JSON.parse(jsonAlexa.val);
        }
    } catch (e) {
        errorLogger('Error in getParsedAlexaJson', e);
    }
}

export const setAdapterStatusAndInitStateCreation = async (): Promise<void> => {
    const adapter = store.adapter;
    const result = await adapter.getForeignObjectAsync(store.pathAlexaStateToListenTo);
    if (!result) {
        adapter.log.warn(`The State ${store.pathAlexaStateToListenTo} was not found!`);
        return;
    }
    adapter.log.info('Alexa State was found');
    await adapter.setState('info.connection', true, true);

    await createStates(4);
};

export function isAlexaSummaryStateChanged({ state, id }: { state?: ioBroker.State | null; id: string }): boolean {
    return isIobrokerValue(state) && isString(state.val) && state.val !== '' && id === store.pathAlexaStateToListenTo;
}

export const isAlexaTimerVisResetButton = (state: ioBroker.State | null | undefined, id: string): boolean =>
    isIobrokerValue(state) && id.includes('.Reset');

export const isTimerAction = (state: ioBroker.State | null | undefined): boolean =>
    [
        'SetNotificationIntent',
        'ShortenNotificationIntent',
        'ExtendNotificationIntent',
        'RemoveNotificationIntent',
    ].includes(String(state?.val ?? ''));
