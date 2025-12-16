import type AlexaTimerVis from '@/main';
import type { AlexaActiveTimerList, LocalAlexaActiveTimerList, StoreType, TimerCondition } from '@/types/types';
import { timerDelete } from '@/app/timer-delete';
import { timerAdd } from '@/app/timer-add';
import { getTimerById } from '@/app/timer';

class Store {
    adapter: AlexaTimerVis;
    valHourForZero: string;
    valMinuteForZero: string;
    valSecondForZero: string;
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
    private localeActiveTimerList: LocalAlexaActiveTimerList[];
    private timeouts: ioBroker.Timeout[] = [];
    private upDateCoolDown = false;
    constructor() {
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
    getAlexaTimerVisInstance(): string {
        return this.alexaTimerVisInstance;
    }
    getNewActiveTimer(
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
    async activeTimeListChangedHandler(id: string, state: ioBroker.State | undefined | null): Promise<void> {
        const list = state?.val;
        if (!id.includes('.Timer.activeTimerList') || !list) {
            return;
        }
        if (this.upDateCoolDown) {
            return;
        }
        this.upDateCoolDown = true;
        let removedId: string | undefined = 'init';
        let addedTimer: AlexaActiveTimerList | undefined = undefined;
        let extendTimer: { listEl: AlexaActiveTimerList; changedSec: number } | undefined = undefined;

        const updatedList = JSON.parse(String(list));
        while (removedId || addedTimer || extendTimer) {
            removedId = this.getRemovedTimerId(updatedList);
            addedTimer = this.getNewActiveTimer(updatedList, id.split('.')[3]);
            extendTimer = this.getActiveTimerWithDifferentTriggerTime(updatedList);

            if (removedId) {
                await timerDelete(removedId);
            }
            if (addedTimer) {
                await timerAdd(addedTimer);
            }
            if (extendTimer) {
                const timer = getTimerById(extendTimer.listEl.id);
                if (timer) {
                    timer.extendTimer(extendTimer.changedSec);
                }
            }
        }
        this.adapter.setTimeout(() => {
            this.upDateCoolDown = false;
        }, 2000);
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
