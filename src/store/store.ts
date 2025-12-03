import type AlexaTimerVis from '@/main';
import type { AlexaActiveTimerList, AlexaInstanceObject, StoreType, TimerCondition } from '@/types/types';

class Store {
    adapter: AlexaTimerVis;
    valHourForZero: string;
    valMinuteForZero: string;
    valSecondForZero: string;
    pathAlexaStateToListenTo: string;
    pathAlexaSummary: string;
    intervalMore60: number;
    intervalLess60: number;
    debounceTime: number;
    unitHour1: string;
    unitHour2: string;
    unitHour3: string;
    unitMinute1: string;
    unitMinute2: string;
    unitMinute3: string;
    unitSecond1: string;
    unitSecond2: string;
    unitSecond3: string;
    timerAction: TimerCondition | null | undefined;
    questionAlexa: boolean;
    interval: ioBroker.Interval | null | undefined;
    deviceSerialNumber: string | null;
    deviceName: string | null;
    lastTimer: { id: string; timerIndex: string; timerSerial: string };
    oldAlexaTimerObject: AlexaActiveTimerList[];
    alexaTimerVisInstance: string;
    constructor() {
        this.pathAlexaStateToListenTo = '';
        this.intervalLess60 = 0;
        this.intervalMore60 = 0;
        this.debounceTime = 0;
        this.unitHour1 = '';
        this.unitHour2 = '';
        this.unitHour3 = '';
        this.unitMinute1 = '';
        this.unitMinute2 = '';
        this.unitMinute3 = '';
        this.unitSecond1 = '';
        this.unitSecond2 = '';
        this.unitSecond3 = '';
        this.lastTimer = { id: '', timerIndex: '', timerSerial: '' };
        this.oldAlexaTimerObject = [];
        this.alexaTimerVisInstance = '';
        this.questionAlexa = false;
        this.interval = null;
        this.deviceSerialNumber = null;
        this.deviceName = null;
        this.pathAlexaSummary = '';
        this.adapter = {} as AlexaTimerVis;
        this.valHourForZero = '';
        this.valMinuteForZero = '';
        this.valSecondForZero = '';
        this.timerAction = null;
    }

    init(store: StoreType): void {
        this.adapter = store.adapter;
        this.valHourForZero = store.valHourForZero;
        this.valMinuteForZero = store.valMinuteForZero;
        this.valSecondForZero = store.valSecondForZero;
        this.pathAlexaStateToListenTo = store.pathAlexaStateToListenTo;
        this.pathAlexaSummary = store.pathAlexaSummary;
        this.intervalMore60 = store.intervalMore60;
        this.intervalLess60 = store.intervalLess60;
        this.debounceTime = store.debounceTime;
        this.unitHour1 = store.unitHour1;
        this.unitHour2 = store.unitHour2;
        this.unitHour3 = store.unitHour3;
        this.unitMinute1 = store.unitMinute1;
        this.unitMinute2 = store.unitMinute2;
        this.unitMinute3 = store.unitMinute3;
        this.unitSecond1 = store.unitSecond1;
        this.unitSecond2 = store.unitSecond2;
        this.unitSecond3 = store.unitSecond3;
    }
    getAlexaInstanceObject(): AlexaInstanceObject {
        const dataPointArray = this.pathAlexaStateToListenTo.split('.');
        return {
            adapter: dataPointArray[0],
            instance: dataPointArray[1],
            channel_history: dataPointArray[2],
        };
    }
    isAddTimer(): boolean {
        return this.timerAction === 'SetNotificationIntent';
    }
    isShortenTimer(): boolean {
        return this.timerAction === 'ShortenNotificationIntent';
    }
    isExtendTimer(): boolean {
        return this.timerAction === 'ExtendNotificationIntent';
    }
    isDeleteTimer(): boolean {
        return this.timerAction === 'RemoveNotificationIntent';
    }
    getAlexaTimerVisInstance(): string {
        return this.alexaTimerVisInstance;
    }
}
export default new Store();
