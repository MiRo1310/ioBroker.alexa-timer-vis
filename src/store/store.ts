import type AlexaTimerVis from '../main';
import type { Store } from '../types/types';

let store: Store;

export function useStore(): Store {
    if (!store) {
        store = {
            _this: '' as unknown as AlexaTimerVis,
            token: '',
            valHourForZero: '',
            valMinuteForZero: '',
            valSecondForZero: '',
            pathAlexaStateToListenTo: '',
            pathAlexaSummary: '',
            intervalMore60: 0,
            intervalLess60: 0,
            debounceTime: 0,
            unitHour1: '',
            unitHour2: '',
            unitHour3: '',
            unitMinute1: '',
            unitMinute2: '',
            unitMinute3: '',
            unitSecond1: '',
            unitSecond2: '',
            unitSecond3: '',
            timerAction: null,
            questionAlexa: false,
            interval: null,
            deviceSerialNumber: null,
            deviceName: null,
            lastTimer: { id: '', timerIndex: '', timerSerial: '' },
            oldAlexaTimerObject: [],
            alexaTimerVisInstance: '',
            getAlexaInstanceObject: () => {
                const dataPointArray = store.pathAlexaStateToListenTo.split('.');
                return {
                    adapter: dataPointArray[0],
                    instance: dataPointArray[1],
                    channel_history: dataPointArray[2],
                };
            },
            isAddTimer: () => {
                return store.timerAction === 'SetNotificationIntent';
            },
            isShortenTimer: () => {
                return store.timerAction === 'ShortenNotificationIntent';
            },
            isExtendTimer: () => {
                return store.timerAction === 'ExtendNotificationIntent';
            },
            isDeleteTimer: () => {
                return store.timerAction === 'RemoveNotificationIntent';
            },
            getAlexaTimerVisInstance: () => {
                return store.alexaTimerVisInstance;
            },
        };
    }
    return store;
}
