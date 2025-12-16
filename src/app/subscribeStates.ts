import store from '@/store/store';

export const subscribeActiveTimerListStates = async (): Promise<void> => {
    const pattern = `${store.alexa2Instance}.*.activeTimerList`;
    const res = await store.adapter.getForeignStatesAsync(pattern);
    Object.keys(res).forEach(id => {
        store.adapter.subscribeForeignStates(id);
    });
};
