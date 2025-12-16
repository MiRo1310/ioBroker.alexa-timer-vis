import store from '@/store/store';

export const subscribeActiveTimerListStates = async (): Promise<void> => {
    const pattern = `alexa2.${store.alexa2Instance}.*.activeTimerList`;
    const res = await store.adapter.getForeignStatesAsync(pattern);
    Object.keys(res).forEach(id => {
        store.adapter.log.debug(`Subscribing to activeTimerList state: ${id}`);
        store.adapter.subscribeForeignStates(id);
    });
};
