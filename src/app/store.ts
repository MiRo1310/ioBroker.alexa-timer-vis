import type AlexaTimerVis from '@/main';
import type { AlexaActiveTimerList, LocalAlexaActiveTimerList, StoreType, TimerCondition } from '@/types/types';
import { timerAdd } from '@/app/timer-add';
import { getTimerById } from '@/app/timer';
import { obj } from '@/config/timer-data';
import { parseJSON } from '@/lib/json';

class Store {
    adapter: AlexaTimerVis;
    valHourForZero: string;
    valMinuteForZero: string;
    valSecondForZero: string;
    pathAlexaSummary: string;
    intervalSecMoreThan60Sec: number;
    intervalSecLessThan60Sec: number;
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
    writeStateInterval: ioBroker.Interval | null | undefined;
    alexaTimerVisInstance: string;
    alexa2Instance: string | null;
    private localeActiveTimerList: LocalAlexaActiveTimerList;
    private timeouts: ioBroker.Timeout[] = [];
    constructor() {
        this.intervalSecLessThan60Sec = 0;
        this.intervalSecMoreThan60Sec = 0;
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
        this.writeStateInterval = null;
        this.pathAlexaSummary = '';
        this.adapter = {} as AlexaTimerVis;
        this.valHourForZero = '';
        this.valMinuteForZero = '';
        this.valSecondForZero = '';
        this.timerAction = null;
        this.localeActiveTimerList = {};
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
        this.intervalSecMoreThan60Sec = intervall1;
        this.intervalSecLessThan60Sec = intervall2;
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

    /**
     * Returns a new active timer by comparing the local active timer list with the provided active timer lists.
     *
     * @param activeTimerLists - The list of currently active timers to compare against.
     * @param deviceSerial - The serial number of the device.
     */
    getNewActiveTimer(
        activeTimerLists: AlexaActiveTimerList[] | undefined,
        deviceSerial: string,
    ): AlexaActiveTimerList | undefined {
        const newestTimer = activeTimerLists?.find(t => !this.includesActiveTimerId(t.id, deviceSerial));
        if (newestTimer) {
            this.localeActiveTimerList[deviceSerial].push({ ...newestTimer, deviceSerialNumber: deviceSerial });
            return newestTimer;
        }
    }
    /**
     * Returns the ID of a removed timer by comparing the local active timer list with the provided active timer lists.
     *
     * @param activeTimerLists - The list of currently active timers to compare against.
     * @param serial - The serial number of the device.
     */
    getRemovedTimerId(activeTimerLists: AlexaActiveTimerList[], serial: string): string | undefined {
        return this.localeActiveTimerList[serial]?.find(activeList => {
            if (!activeTimerLists.some(t => t.id === activeList.id)) {
                return activeList;
            }
        })?.id;
    }
    /**
     * Returns an active timer with a different trigger time by comparing the local active timer list with the provided active timer lists.
     *
     * @param activeTimerLists - The list of currently active timers to compare against.
     * @param serial - The serial number of the device.
     */
    getActiveTimerWithDifferentTriggerTime(
        activeTimerLists: AlexaActiveTimerList[],
        serial: string,
    ): { listEl: AlexaActiveTimerList; changedSec: number } | undefined {
        let changedSec = 0;
        const listEl = activeTimerLists.find(activeList =>
            this.localeActiveTimerList[serial].some(localActiveList => {
                if (activeList.id === localActiveList.id && activeList.triggerTime !== localActiveList.triggerTime) {
                    changedSec = activeList.triggerTime - localActiveList.triggerTime;
                    return true;
                }
                return false;
            }),
        );
        return listEl ? { listEl, changedSec } : undefined;
    }

    /**
     * Removes an active timer ID from the local active timer list.
     *
     * @param id - The ID of the active timer to remove.
     * @param serial - The serial number of the device.
     */
    removeActiveTimerId(id: string, serial: string): void {
        this.localeActiveTimerList[serial] = this.localeActiveTimerList[serial]?.filter(t => t.id !== id);
    }

    /**
     * Checks if an active timer ID exists in the local active timer list.
     *
     * @param id - The ID of the active timer to check.
     * @param serial - The serial number of the device.
     */
    includesActiveTimerId(id: string, serial: string): boolean {
        return this.localeActiveTimerList[serial].some(t => t.id === id);
    }
    isIdFromActiveTimerList(id: string): boolean {
        return id.includes('.Timer.activeTimerList');
    }
    async activeTimeListChangedHandler(id: string, state: ioBroker.State | undefined | null): Promise<void> {
        const stateValue = state?.val;
        if (!this.isIdFromActiveTimerList(id) || !stateValue) {
            return;
        }

        let removedId: string | undefined = 'init';
        let addedTimer: AlexaActiveTimerList | undefined;
        let extendTimer: { listEl: AlexaActiveTimerList; changedSec: number } | undefined;

        const updatedList = parseJSON<AlexaActiveTimerList[]>(String(stateValue));
        const serial = this.getSerialFromIobrokerStateId(id);
        while ((removedId || addedTimer || extendTimer) && serial && updatedList.isValidJson) {
            removedId = this.getRemovedTimerId(updatedList.ob, serial);
            addedTimer = this.getNewActiveTimer(updatedList.ob, serial);
            extendTimer = this.getActiveTimerWithDifferentTriggerTime(updatedList.ob, serial);

            if (removedId) {
                const timer = getTimerById(removedId);
                if (timer) {
                    await timer.reset();
                    const index = this.localeActiveTimerList[serial].findIndex(el => el?.id === removedId);
                    this.localeActiveTimerList[serial].splice(index, 1);
                }
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
    }

    /**
     * Adds a serial number to the local active timer list if it doesn't already exist.
     *
     * @param deviceSerial - The serial number to add.
     */
    addSerialToLocalActiveTimerList(deviceSerial?: string): void {
        if (deviceSerial && !this.localeActiveTimerList[deviceSerial]) {
            this.localeActiveTimerList[deviceSerial] = [];
        }
    }

    /**
     * Extracts the serial number from the given ID.
     *
     * @param id - The ID string to extract the serial number from.
     */
    getSerialFromIobrokerStateId(id: string): string | undefined {
        return id.split('.')[3];
    }

    /**
     * Clears a timeout and removes it from the internal list.
     *
     * @param t - The timeout to clear.
     */
    clearTimeout(t: ioBroker.Timeout | undefined): void {
        this.adapter.clearTimeout(t);
        this.timeouts = this.timeouts.filter(t => t !== t);
    }

    /**
     * Clears all stored timeouts.
     */
    clearTimeouts(): void {
        this.timeouts.forEach(timeout => this.clearTimeout(timeout));
    }

    /**
     * Returns boolean indicating if any timer is currently running.
     */
    isSomeTimerRunning(): boolean {
        return Object.keys(obj.timers).some(t => obj.timers[t].isActive);
    }
}
export default new Store();
