import type AlexaTimerVis from '@/main';
import type { AlexaActiveTimerList, LocalAlexaActiveTimerList, StoreType, TimerCondition } from '@/types/types';
import { timerDelete } from '@/app/timer-delete';

class Store {
    adapter: AlexaTimerVis;
    valHourForZero: string;
    valMinuteForZero: string;
    valSecondForZero: string;
    pathAlexaStateIntent: string;
    pathAlexaSummary: string;
    intervalMore60: number;
    intervalLess60: number;
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
    alexa2Instance: string | null;
    activeTimeListChanged: Record<string, boolean>;
    private subscribedIds: string[];
    private localeActiveTimerList: LocalAlexaActiveTimerList[];
    private coolDownSetStatus = false;
    private timeouts: ioBroker.Timeout[] = [];
    constructor() {
        this.pathAlexaStateIntent = '';
        this.intervalLess60 = 0;
        this.intervalMore60 = 0;
        this.unitHour1 = 'Stunde';
        this.unitHour2 = 'Stunden';
        this.unitHour3 = '';
        this.unitMinute1 = 'Minute';
        this.unitMinute2 = 'Minuten';
        this.unitMinute3 = '';
        this.unitSecond1 = 'Sekunde';
        this.unitSecond2 = 'Sekunden';
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
        this.localeActiveTimerList = [];
        this.alexa2Instance = null;
        this.activeTimeListChanged = {};
        this.subscribedIds = [];
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
            alexaTimerVisInstance,
        } = store;
        this.valHourForZero = valHourForZero;
        this.valMinuteForZero = valMinuteForZero;
        this.valSecondForZero = valSecondForZero;
        this.pathAlexaStateIntent = `${alexa}.History.intent`;
        this.alexa2Instance = alexa.split('.')[1];
        this.pathAlexaSummary = `${alexa}.History.summary`;
        this.intervalMore60 = intervall1;
        this.intervalLess60 = intervall2;
        this.unitHour1 = unitHour1;
        this.unitHour2 = unitHour2;
        this.unitHour3 = unitHour3;
        this.unitMinute1 = unitMinute1;
        this.unitMinute2 = unitMinute2;
        this.unitMinute3 = unitMinute3;
        this.unitSecond1 = unitSecond1;
        this.unitSecond2 = unitSecond2;
        this.unitSecond3 = unitSecond3;
        this.alexaTimerVisInstance = alexaTimerVisInstance;
    }
    getAlexa2Instance(): string | null {
        return this.alexa2Instance;
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
    getAlexaTimerVisInstance(): string {
        return this.alexaTimerVisInstance;
    }
    getNewActiveTimerId(
        activeTimerLists: AlexaActiveTimerList[] | undefined,
        deviceSerialNumber: string,
    ): AlexaActiveTimerList | undefined {
        const newestTimer = activeTimerLists?.find(t => !this.includesActiveTimerId(t.id));
        if (newestTimer) {
            this.localeActiveTimerList.push({ ...newestTimer, deviceSerialNumber });
            return newestTimer;
        }
    }
    getRemovedTimerId(activeTimerLists: AlexaActiveTimerList[]): string | undefined {
        const timerIdToDelete = this.localeActiveTimerList.find(activeList => {
            if (!activeTimerLists.some(t => t.id === activeList.id)) {
                return activeList;
            }
        })?.id;

        if (timerIdToDelete) {
            const index = this.localeActiveTimerList.findIndex(el => el.id === timerIdToDelete);
            this.localeActiveTimerList.splice(index, 1);
            return timerIdToDelete;
        }
    }
    getActiveTimerWithDifferentTriggerTime(
        activeTimerLists: AlexaActiveTimerList[],
    ): { listEl: AlexaActiveTimerList; changedSec: number } | undefined {
        let changedSec = 0;
        const listEl = activeTimerLists.find(activeList =>
            this.localeActiveTimerList.some(localActiveList => {
                if (activeList.id === localActiveList.id && activeList.triggerTime !== localActiveList.triggerTime) {
                    changedSec = activeList.triggerTime - localActiveList.triggerTime;
                    return true;
                }
                return false;
            }),
        );
        return listEl ? { listEl, changedSec } : undefined;
    }
    removeActiveTimerId(id: string): void {
        this.localeActiveTimerList = this.localeActiveTimerList.filter(t => t.id !== id);
    }
    includesActiveTimerId(id: string): boolean {
        return this.localeActiveTimerList.some(t => t.id === id);
    }
    getLocalActiveTimerList(): LocalAlexaActiveTimerList[] {
        return this.localeActiveTimerList;
    }
    async activeTimeListChangedHandler(id: string): Promise<boolean> {
        if (id.includes('.Timer.activeTimerList')) {
            await timerDelete();
            if (this.coolDownSetStatus) {
                return true;
            }
            this.coolDownSetStatus = true;
            const serial = id.split('.')[3];
            this.activeTimeListChanged[serial] = true;
            const timeout = this.adapter.setTimeout(() => {
                this.coolDownSetStatus = false;
            }, 2000);
            this.addTimeout(timeout);
            return true;
        }
        return false;
    }
    activeTimeListChangedIsHandled(serial: string): void {
        this.activeTimeListChanged[serial] = false;
    }
    getActiveTimeListChangedStatus(serial: string): boolean {
        return serial in this.activeTimeListChanged && this.activeTimeListChanged[serial];
    }
    async handleSubscribeForeignStates(id: string): Promise<void> {
        if (this.subscribedIds.includes(id)) {
            return;
        }
        await this.adapter.subscribeForeignStatesAsync(id);
        this.subscribedIds.push(id);
        this.adapter.log.debug(`Subscribed: ${id}`);
    }
    addTimeout(timeout: ioBroker.Timeout | undefined): void {
        if (timeout) {
            this.timeouts.push(timeout);
        }
    }
    clearTimeout(timeout: ioBroker.Timeout | undefined): void {
        this.adapter.clearTimeout(timeout);
        this.timeouts = this.timeouts.filter(t => t !== timeout);
    }
    clearTimeouts(): void {
        this.timeouts.forEach(timeout => this.clearTimeout(timeout));
    }
}
export default new Store();
