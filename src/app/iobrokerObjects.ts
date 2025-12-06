import type { TimerIndex } from '@/types/types';
import store from '@/store/store';
import { errorLogger } from '@/lib/logging';

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
