import store from '@/store/store';
import { createStates } from '@/app/createStates';

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
