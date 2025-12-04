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
    alexaTimerVisInstance: string;
    private activeTimerIds: string[];
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

        this.alexaTimerVisInstance = '';
        this.questionAlexa = false;
        this.interval = null;
        this.pathAlexaSummary = '';
        this.adapter = {} as AlexaTimerVis;
        this.valHourForZero = '';
        this.valMinuteForZero = '';
        this.valSecondForZero = '';
        this.timerAction = null;
        this.activeTimerIds = [];
    }

    init(store: StoreType): void {
        this.adapter = store.adapter;
        const {
            alexa,
            valHourForZero,
            valMinuteForZero,
            valSecondForZero,
            unitSecond3,
            unitSecond2,
            unitSecond1,
            unitHour1,
            unitHour2,
            unitHour3,
            unitMinute1,
            unitMinute2,
            unitMinute3,
            intervall1,
            intervall2,
            entprellZeit,
        } = store.adapter.config;
        this.valHourForZero = valHourForZero;
        this.valMinuteForZero = valMinuteForZero;
        this.valSecondForZero = valSecondForZero;
        this.pathAlexaStateToListenTo = `${alexa}.History.intent`;
        this.pathAlexaSummary = `${alexa}.History.summary`;
        this.intervalMore60 = intervall1;
        this.intervalLess60 = intervall2;
        this.debounceTime = entprellZeit;
        this.unitHour1 = unitHour1;
        this.unitHour2 = unitHour2;
        this.unitHour3 = unitHour3;
        this.unitMinute1 = unitMinute1;
        this.unitMinute2 = unitMinute2;
        this.unitMinute3 = unitMinute3;
        this.unitSecond1 = unitSecond1;
        this.unitSecond2 = unitSecond2;
        this.unitSecond3 = unitSecond3;
        this.alexaTimerVisInstance = store.alexaTimerVisInstance;
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
    addNewActiveTimerId(activeTimerLists: AlexaActiveTimerList[]): string | undefined {
        const newestTimer = activeTimerLists.find(t => !this.includesActiveTimerId(t.id));
        if (newestTimer) {
            this.activeTimerIds.push(newestTimer.id);
            return newestTimer.id;
        }
    }
    removeActiveTimerId(id: string): void {
        this.activeTimerIds = this.activeTimerIds.filter(activeId => activeId !== id);
    }
    includesActiveTimerId(id: string): boolean {
        return this.activeTimerIds.includes(id);
    }
}
export default new Store();
