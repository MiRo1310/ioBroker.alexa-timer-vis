// typescript
import { expect } from 'chai';
import sinon from 'sinon';
import store from '@/app/store';
import { Timer } from '@/app/timer';
import { obj } from '@/config/timer-data';
import type { LocalAlexaActiveTimerList } from '@/types/types';

describe('Store.getRemovedTimerId', () => {
    const serial = 'serial123';
    const defaultValues = { deviceSerialNumber: '', triggerTime: 0, durationMillis: 0, label: '' };
    const localActiveTimerList: LocalAlexaActiveTimerList = {
        [serial]: [
            { id: 't1', ...defaultValues },
            { id: 't2', ...defaultValues },
            { id: 't3', ...defaultValues },
        ],
    };
    beforeEach(() => {
        (store as any).localeActiveTimerList = localActiveTimerList;
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = [];
    });

    it('entfernt ein fehlendes Timer-ID und gibt diese zurück', () => {
        const activeTimerLists = [{ id: 't2' }]; // t1 und t3 fehlt -> sollte entfernt werden
        const removed = (store as any).getRemovedTimerId(activeTimerLists, serial);
        expect(removed).to.equal('t1');
        (store as any).localeActiveTimerList = {
            [serial]: [
                { id: 't2', ...defaultValues },
                { id: 't3', ...defaultValues },
            ],
        };
        const removed2 = (store as any).getRemovedTimerId(activeTimerLists, serial);
        expect(removed2).to.equal('t3');
    });

    it('gibt undefined zurück, wenn keine ID fehlt', () => {
        const activeTimerLists = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
        const removed = (store as any).getRemovedTimerId(activeTimerLists, serial);
        expect(removed).to.be.undefined;
    });

    it('gibt undefined zurück , wenn keine ID fehlt bzw eine mehr da ist', () => {
        const activeTimerLists = [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }];
        const removed = (store as any).getRemovedTimerId(activeTimerLists, serial);
        expect(removed).to.be.undefined;
    });
});

describe('Store.activeTimeListChangedHandler - extendTimer Endlosschleife', () => {
    const serial = 'ABC123SERIAL';
    const timerId = 'timer-extend-test';
    const originalTriggerTime = 1_000_000;
    const newTriggerTime = 1_060_000;
    const defaultValues = { deviceSerialNumber: '', durationMillis: 0, label: '' };

    let fakeTimer: Timer;
    let extendTimerStub: sinon.SinonStub;
    const stateId = `alexa2.0.Echo-Devices.${serial}.Timer.activeTimerList`;
    const updatedList = JSON.stringify([{ id: timerId, triggerTime: newTriggerTime, ...defaultValues }]);

    beforeEach(() => {
        fakeTimer = new Timer({ store });
        (fakeTimer as any).timerId = timerId;
        extendTimerStub = sinon.stub(fakeTimer, 'extendTimer').callsFake(() => {
            // Sicherheitsnetz: verhindert echtes Hängen im Test.
            // Ohne Fix werden 3 Aufrufe gezählt, bevor der Loop manuell gebrochen wird.
            if (extendTimerStub.callCount >= 3) {
                (store as any).localeActiveTimerList[serial][0].triggerTime = newTriggerTime;
            }
        });
        obj.timers.timer1 = fakeTimer;
        (store as any).localeActiveTimerList = {
            [serial]: [{ id: timerId, triggerTime: originalTriggerTime, ...defaultValues }],
        };
    });

    afterEach(() => {
        delete obj.timers.timer1;
        (store as any).localeActiveTimerList = {};
        sinon.restore();
    });

    it('ruft extendTimer genau einmal auf', async () => {
        await (store as any).activeTimeListChangedHandler(stateId, { val: updatedList });
        expect(extendTimerStub.callCount).to.equal(1);
    });

    it('übergibt die korrekte Zeitdifferenz an extendTimer', async () => {
        await (store as any).activeTimeListChangedHandler(stateId, { val: updatedList });
        expect(extendTimerStub.calledWith(newTriggerTime - originalTriggerTime)).to.be.true;
    });

    it('aktualisiert localeActiveTimerList mit dem neuen triggerTime', async () => {
        await (store as any).activeTimeListChangedHandler(stateId, { val: updatedList });
        const localTimer = (store as any).localeActiveTimerList[serial].find((t: any) => t.id === timerId);
        expect(localTimer?.triggerTime).to.equal(newTriggerTime);
    });
});

describe('Store.updateLocalActiveTimerTriggerTime', () => {
    const serial = 'SERIAL99';
    const timerId = 'timer-update-test';
    const defaultValues = { deviceSerialNumber: '', durationMillis: 0, label: '' };

    beforeEach(() => {
        (store as any).localeActiveTimerList = {
            [serial]: [{ id: timerId, triggerTime: 500_000, ...defaultValues }],
        };
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = {};
    });

    it('aktualisiert den triggerTime des passenden Timers', () => {
        (store as any).updateLocalActiveTimerTriggerTime(timerId, 999_000, serial);
        const localTimer = (store as any).localeActiveTimerList[serial].find((t: any) => t.id === timerId);
        expect(localTimer?.triggerTime).to.equal(999_000);
    });

    it('tut nichts bei unbekannter Timer-ID', () => {
        (store as any).updateLocalActiveTimerTriggerTime('unknown-id', 999_000, serial);
        const localTimer = (store as any).localeActiveTimerList[serial].find((t: any) => t.id === timerId);
        expect(localTimer?.triggerTime).to.equal(500_000);
    });

    it('nach Aktualisierung gibt getActiveTimerWithDifferentTriggerTime undefined zurück', () => {
        (store as any).updateLocalActiveTimerTriggerTime(timerId, 999_000, serial);
        const activeTimerLists = [{ id: timerId, triggerTime: 999_000, ...defaultValues }];
        const result = (store as any).getActiveTimerWithDifferentTriggerTime(activeTimerLists, serial);
        expect(result).to.be.undefined;
    });
});

describe('Store.getNewActiveTimer', () => {
    const serial = 'NEW_SERIAL';
    const defaultValues = { deviceSerialNumber: '', triggerTime: 0, durationMillis: 0, label: '' };

    afterEach(() => {
        (store as any).localeActiveTimerList = {};
    });

    it('gibt den neuen Timer zurück und fügt ihn zur lokalen Liste hinzu', () => {
        (store as any).localeActiveTimerList = { [serial]: [] };
        const activeTimerLists = [{ id: 'new-timer', ...defaultValues }];
        const result = (store as any).getNewActiveTimer(activeTimerLists, serial);
        expect(result?.id).to.equal('new-timer');
        expect((store as any).localeActiveTimerList[serial]).to.have.length(1);
    });

    it('gibt undefined zurück wenn Timer bereits in der lokalen Liste ist', () => {
        (store as any).localeActiveTimerList = {
            [serial]: [{ id: 'existing-timer', ...defaultValues }],
        };
        const activeTimerLists = [{ id: 'existing-timer', ...defaultValues }];
        const result = (store as any).getNewActiveTimer(activeTimerLists, serial);
        expect(result).to.be.undefined;
    });

    it('legt eine leere Liste an wenn das Serial noch nicht existiert', () => {
        (store as any).localeActiveTimerList = {};
        (store as any).getNewActiveTimer([], serial);
        expect((store as any).localeActiveTimerList[serial]).to.deep.equal([]);
    });

    it('gibt undefined zurück bei undefined activeTimerLists', () => {
        (store as any).localeActiveTimerList = { [serial]: [] };
        const result = (store as any).getNewActiveTimer(undefined, serial);
        expect(result).to.be.undefined;
    });
});

describe('Store.includesActiveTimerId', () => {
    const serial = 'INCL_SERIAL';
    const defaultValues = { deviceSerialNumber: '', triggerTime: 0, durationMillis: 0, label: '' };

    beforeEach(() => {
        (store as any).localeActiveTimerList = {
            [serial]: [{ id: 'timer-x', ...defaultValues }],
        };
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = {};
    });

    it('gibt true zurück wenn ID in der Liste vorhanden ist', () => {
        expect((store as any).includesActiveTimerId('timer-x', serial)).to.be.true;
    });

    it('gibt false zurück wenn ID nicht vorhanden ist', () => {
        expect((store as any).includesActiveTimerId('timer-z', serial)).to.be.false;
    });

    it('gibt false zurück für unbekanntes Serial', () => {
        expect((store as any).includesActiveTimerId('timer-x', 'UNKNOWN')).to.be.false;
    });
});

describe('Store.isIdFromActiveTimerList', () => {
    it('gibt true zurück für IDs mit .Timer.activeTimerList', () => {
        expect((store as any).isIdFromActiveTimerList('alexa2.0.Echo-Devices.ABC.Timer.activeTimerList')).to.be.true;
    });

    it('gibt false zurück für IDs ohne .Timer.activeTimerList', () => {
        expect((store as any).isIdFromActiveTimerList('alexa2.0.Echo-Devices.ABC.Timer.status')).to.be.false;
    });

    it('gibt false zurück für leere ID', () => {
        expect((store as any).isIdFromActiveTimerList('')).to.be.false;
    });
});

describe('Store.getSerialFromIobrokerStateId', () => {
    it('extrahiert das Serial an Position [3]', () => {
        expect(
            (store as any).getSerialFromIobrokerStateId('alexa2.0.Echo-Devices.ABC123.Timer.activeTimerList'),
        ).to.equal('ABC123');
    });

    it('gibt undefined zurück wenn die ID weniger als 4 Teile hat', () => {
        expect((store as any).getSerialFromIobrokerStateId('alexa2.0')).to.be.undefined;
    });
});

describe('Store.addSerialToLocalActiveTimerList', () => {
    afterEach(() => {
        (store as any).localeActiveTimerList = {};
    });

    it('fügt ein neues Serial mit leerer Liste hinzu', () => {
        (store as any).localeActiveTimerList = {};
        (store as any).addSerialToLocalActiveTimerList('NEW_SERIAL');
        expect((store as any).localeActiveTimerList.NEW_SERIAL).to.deep.equal([]);
    });

    it('überschreibt eine bereits existierende Liste nicht', () => {
        (store as any).localeActiveTimerList = { EXISTING: [{ id: 'x' }] };
        (store as any).addSerialToLocalActiveTimerList('EXISTING');
        expect((store as any).localeActiveTimerList.EXISTING).to.have.length(1);
    });

    it('ignoriert undefined', () => {
        (store as any).localeActiveTimerList = {};
        (store as any).addSerialToLocalActiveTimerList(undefined);
        expect(Object.keys((store as any).localeActiveTimerList)).to.have.length(0);
    });
});

describe('Store.isSomeTimerRunning', () => {
    let savedTimers: any;

    beforeEach(() => {
        savedTimers = { ...obj.timers };
        obj.timers = {};
    });

    afterEach(() => {
        obj.timers = savedTimers;
    });

    it('gibt false zurück wenn obj.timers leer ist', () => {
        expect(store.isSomeTimerRunning()).to.be.false;
    });

    it('gibt false zurück wenn alle Timer inaktiv sind', () => {
        const t1 = new Timer({ store });
        const t2 = new Timer({ store });
        obj.timers.timer1 = t1;
        obj.timers.timer2 = t2;
        expect(store.isSomeTimerRunning()).to.be.false;
    });

    it('gibt true zurück wenn mindestens ein Timer aktiv ist', () => {
        const t1 = new Timer({ store });
        const t2 = new Timer({ store });
        (t1 as any)._isActive = true;
        obj.timers.timer1 = t1;
        obj.timers.timer2 = t2;
        expect(store.isSomeTimerRunning()).to.be.true;
    });
});

describe('Store.init', () => {
    let snapshot: Record<string, any>;

    beforeEach(() => {
        snapshot = {
            adapter: store.adapter,
            alexa2Instance: (store as any).alexa2Instance,
            alexaTimerVisInstance: (store as any).alexaTimerVisInstance,
            pathAlexaSummary: (store as any).pathAlexaSummary,
            intervalSecMoreThan60Sec: store.intervalSecMoreThan60Sec,
            intervalSecLessThan60Sec: store.intervalSecLessThan60Sec,
            unitHour1: store.unitHour1,
            unitHour2: store.unitHour2,
            unitHour3: store.unitHour3,
            unitMinute1: store.unitMinute1,
            unitMinute2: store.unitMinute2,
            unitMinute3: store.unitMinute3,
            unitSecond1: store.unitSecond1,
            unitSecond2: store.unitSecond2,
            unitSecond3: store.unitSecond3,
            valHourForZero: store.valHourForZero,
            valMinuteForZero: store.valMinuteForZero,
            valSecondForZero: store.valSecondForZero,
        };
    });

    afterEach(() => {
        Object.assign(store, snapshot);
    });

    it('setzt alle Eigenschaften aus dem StoreType-Objekt', () => {
        store.init({
            adapter: {} as any,
            alexa: 'alexa2.0',
            alexaTimerVisInstance: 'alexa-timer-vis.0',
            intervall1: 5,
            intervall2: 1,
            unitHour1: 'Std1',
            unitHour2: 'Std2',
            unitHour3: ' Std',
            unitMinute1: 'Min1',
            unitMinute2: 'Min2',
            unitMinute3: ' Min',
            unitSecond1: 'Sek1',
            unitSecond2: 'Sek2',
            unitSecond3: ' Sek',
            valHourForZero: 'h0',
            valMinuteForZero: 'm0',
            valSecondForZero: 's0',
        });
        expect(store.getAlexa2Instance()).to.equal('0');
        expect(store.getAlexaTimerVisInstance()).to.equal('alexa-timer-vis.0');
        expect(store.intervalSecMoreThan60Sec).to.equal(5);
        expect(store.intervalSecLessThan60Sec).to.equal(1);
        expect(store.valHourForZero).to.equal('h0');
        expect(store.unitHour3).to.equal(' Std');
    });
});

describe('Store.getAlexa2Instance / getAlexaTimerVisInstance', () => {
    it('getAlexa2Instance gibt den gesetzten Wert zurück', () => {
        (store as any).alexa2Instance = 'my-instance';
        expect(store.getAlexa2Instance()).to.equal('my-instance');
    });

    it('getAlexaTimerVisInstance gibt den gesetzten Wert zurück', () => {
        (store as any).alexaTimerVisInstance = 'my-vis.0';
        expect(store.getAlexaTimerVisInstance()).to.equal('my-vis.0');
    });
});

describe('Store.removeActiveTimerId', () => {
    const serial = 'REMOVE_SERIAL';

    beforeEach(() => {
        (store as any).localeActiveTimerList = {
            [serial]: [
                { id: 't1', triggerTime: 0, durationMillis: 0, label: '', deviceSerialNumber: '' },
                { id: 't2', triggerTime: 0, durationMillis: 0, label: '', deviceSerialNumber: '' },
            ],
        };
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = {};
    });

    it('entfernt den Timer mit der angegebenen ID', () => {
        (store as any).removeActiveTimerId('t1', serial);
        const list = (store as any).localeActiveTimerList[serial];
        expect(list).to.have.length(1);
        expect(list[0].id).to.equal('t2');
    });

    it('tut nichts bei unbekanntem Serial', () => {
        (store as any).removeActiveTimerId('t1', 'UNKNOWN');
        expect((store as any).localeActiveTimerList[serial]).to.have.length(2);
    });
});

describe('Store.getActiveTimerWithDifferentTriggerTime', () => {
    const serial = 'DIFF_SERIAL';
    const defaultValues = { deviceSerialNumber: '', durationMillis: 0, label: '' };

    beforeEach(() => {
        (store as any).localeActiveTimerList = {
            [serial]: [{ id: 'timer1', triggerTime: 1000, ...defaultValues }],
        };
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = {};
    });

    it('gibt Timer mit korrekter Zeitdifferenz zurück', () => {
        const lists = [{ id: 'timer1', triggerTime: 2000, ...defaultValues }];
        const result = (store as any).getActiveTimerWithDifferentTriggerTime(lists, serial);
        expect(result).to.not.be.undefined;
        expect(result.changedSec).to.equal(1000);
    });

    it('gibt undefined zurück wenn kein triggerTime-Unterschied vorliegt', () => {
        const lists = [{ id: 'timer1', triggerTime: 1000, ...defaultValues }];
        const result = (store as any).getActiveTimerWithDifferentTriggerTime(lists, serial);
        expect(result).to.be.undefined;
    });
});

describe('Store.clearTimeout / clearTimeouts', () => {
    let clearTimeoutStub: sinon.SinonStub;

    beforeEach(() => {
        clearTimeoutStub = sinon.stub();
        (store as any).adapter = { clearTimeout: clearTimeoutStub };
        (store as any).timeouts = [100, 200, 300];
    });

    afterEach(() => {
        (store as any).adapter = {};
        (store as any).timeouts = [];
        sinon.restore();
    });

    it('clearTimeout ruft adapter.clearTimeout auf', () => {
        store.clearTimeout(100 as any);
        expect(clearTimeoutStub.calledWith(100)).to.be.true;
    });

    it('clearTimeout entfernt den Timeout aus der internen Liste', () => {
        store.clearTimeout(200 as any);
        expect((store as any).timeouts).to.not.include(200);
        expect((store as any).timeouts).to.have.length(2);
    });

    it('clearTimeouts löscht alle gespeicherten Timeouts', () => {
        store.clearTimeouts();
        expect(clearTimeoutStub.callCount).to.equal(3);
        expect((store as any).timeouts).to.have.length(0);
    });
});

describe('Store.activeTimeListChangedHandler - frühe Rückgaben', () => {
    it('gibt undefined zurück wenn id kein activeTimerList ist', async () => {
        const result = await (store as any).activeTimeListChangedHandler('some.other.id', { val: '[]' });
        expect(result).to.be.undefined;
    });

    it('gibt undefined zurück wenn state null ist', async () => {
        const result = await (store as any).activeTimeListChangedHandler(
            'alexa2.0.Echo-Devices.ABC.Timer.activeTimerList',
            null,
        );
        expect(result).to.be.undefined;
    });

    it('gibt undefined zurück wenn state.val leer ist', async () => {
        const result = await (store as any).activeTimeListChangedHandler(
            'alexa2.0.Echo-Devices.ABC.Timer.activeTimerList',
            { val: '' },
        );
        expect(result).to.be.undefined;
    });

    it('gibt undefined zurück wenn JSON ungültig ist', async () => {
        sinon.stub(console, 'log');
        (store as any).localeActiveTimerList = { ABC: [] };
        const result = await (store as any).activeTimeListChangedHandler(
            'alexa2.0.Echo-Devices.ABC.Timer.activeTimerList',
            { val: 'kein-json' },
        );
        expect(result).to.be.undefined;
        (store as any).localeActiveTimerList = {};
        sinon.restore();
    });

    it('verarbeitet einen entfernten Timer korrekt (removedId-Pfad)', async () => {
        const serial = 'REMOVE_TEST';
        const timerId = 'removed-id';
        const fakeTimer = new Timer({ store });
        (fakeTimer as any).timerId = timerId;
        const savedTimers = { ...obj.timers };
        obj.timers['timer-for-remove'] = fakeTimer;
        (store as any).localeActiveTimerList = {
            [serial]: [{ id: timerId, triggerTime: 1000, durationMillis: 0, label: '', deviceSerialNumber: serial }],
        };
        const stateId = `alexa2.0.Echo-Devices.${serial}.Timer.activeTimerList`;
        await (store as any).activeTimeListChangedHandler(stateId, { val: JSON.stringify([]) });
        expect((store as any).localeActiveTimerList[serial]).to.have.length(0);
        obj.timers = savedTimers;
        (store as any).localeActiveTimerList = {};
    });
});
