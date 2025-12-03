import { useStore } from '../store/store';
import { createStates } from '../app/createStates';

export const setAdapterStatusAndInitStateCreation = async (): Promise<void> => {
    const store = useStore();
    const _this = store._this;

    const result = await _this.getForeignObjectAsync(store.pathAlexaStateToListenTo);
    if (!result) {
        _this.log.warn(`The State ${store.pathAlexaStateToListenTo} was not found!`);
        return;
    }
    _this.log.info('Alexa State was found');
    await _this.setState('info.connection', true, true);

    await createStates(4);
};
