import type { AlexaActiveTimerList, AlexaJson, TimerIndex } from '@/types/types';
import store from '@/store/store';
import errorLogger from '@/lib/logging';
import { isString } from '@/lib/string';
import { createStates } from '@/app/createStates';
import { isIobrokerValue } from '@/lib/state';
import { sleep } from '@/lib/time';

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

export const setAdapterStatusAndInitStateCreation = async (): Promise<void> => {
    const adapter = store.adapter;
    const result = await adapter.getForeignObjectAsync(store.pathAlexaStateIntent);
    if (!result) {
        adapter.log.warn(`The State ${store.pathAlexaStateIntent} was not found!`);
        return;
    }
    adapter.log.info('Alexa State was found');
    await adapter.setState('info.connection', true, true);

    await createStates(4);
};

export function isAlexaStateIntentUpdated({ state, id }: { state?: ioBroker.State | null; id: string }): boolean {
    return isIobrokerValue(state) && isString(state.val) && state.val !== '' && id === store.pathAlexaStateIntent;
}

export const isAlexaTimerVisResetButton = (state: ioBroker.State | null | undefined, id: string): boolean =>
    isIobrokerValue(state) && id.includes('.Reset');

export const isTimerAction = (state: ioBroker.State | null | undefined): boolean =>
    ['SetNotificationIntent', 'ShortenNotificationIntent', 'ExtendNotificationIntent'].includes(
        String(state?.val ?? ''),
    );

export const getActiveAlexaTimerListForDevice = async (
    deviceSerialNumber: string,
    disableLoop = false,
): Promise<AlexaActiveTimerList[] | undefined> => {
    const instance = store.getAlexa2Instance();
    if (!instance) {
        //TODO
        return;
    }

    const activeTimerListId = `alexa2.${instance}.Echo-Devices.${deviceSerialNumber}.Timer.activeTimerList`;

    let loopIndex = 0;
    //TODO
    store.adapter.log.debug(`Status: ${store.getActiveTimeListChangedStatus(deviceSerialNumber)}`);

    while (loopIndex < 20 && !store.getActiveTimeListChangedStatus(deviceSerialNumber) && !disableLoop) {
        await sleep(500);
        //TODO
        store.adapter.log.debug(`Status in Loop: ${store.getActiveTimeListChangedStatus(deviceSerialNumber)}`);
        store.adapter.log.debug(`LoopIndex: ${loopIndex}`);
        loopIndex++;
    }
    store.activeTimeListChangedIsHandled(deviceSerialNumber);
    const activeTimerListState = await store.adapter.getForeignStateAsync(activeTimerListId);

    return activeTimerListState?.val ? (JSON.parse(String(activeTimerListState.val)) as AlexaActiveTimerList[]) : [];
};
