import { expect } from 'chai';
import sinon from 'sinon';
import store from '@/app/store';
import { obj } from '@/config/timer-data';
import { timerAdd } from '@/app/timer-add';
import { startTimer } from '@/app/timer-start';
import type { AlexaActiveTimerList } from '@/types/types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makeFakeAdapter = () => ({
    log: { debug: sinon.stub(), warn: sinon.stub(), info: sinon.stub(), error: sinon.stub() },
    setObjectNotExistsAsync: sinon.stub().resolves(),
    subscribeForeignStates: sinon.stub(),
    getForeignStateAsync: sinon.stub().resolves({ val: 'Echo Dot', ack: true, ts: 0, lc: 0, from: '', q: 0 }),
    extendObject: sinon.stub().callsFake((_p: any, _o: any, cb: any) => cb(null)),
    setInterval: sinon.stub().returns(55),
    clearInterval: sinon.stub(),
    setStateChanged: sinon.stub(),
    getObjectAsync: sinon.stub().resolves({ type: 'state' }),
    instance: 0,
});

const newTimer: AlexaActiveTimerList = {
    id: 'test-add-id',
    label: 'Küche',
    triggerTime: Date.now() + 300_000,
    durationMillis: 300_000,
};

describe('timerAdd', () => {
    let fakeAdapter: ReturnType<typeof makeFakeAdapter>;
    let savedTimers: any;
    let savedStatus: any;
    let savedInterval: any;
    let savedCount: number;

    beforeEach(() => {
        fakeAdapter = makeFakeAdapter();
        (store as any).adapter = fakeAdapter;
        store.writeStateInterval = null;
        savedTimers = { ...obj.timers };
        savedStatus = { ...obj.status };
        savedInterval = { ...obj.interval };
        savedCount = (obj.count as any).count;
        (obj.count as any).count = 0;
        obj.timers = {};
        obj.interval = { timer1: null };
    });

    afterEach(() => {
        obj.timers = savedTimers;
        obj.status = savedStatus;
        obj.interval = savedInterval;
        (obj.count as any).count = savedCount;
        store.writeStateInterval = null;
        (store as any).adapter = {};
        sinon.restore();
    });

    it('erstellt States und startet den Timer', async () => {
        await timerAdd(newTimer);
        expect(fakeAdapter.setObjectNotExistsAsync.called).to.be.true;
        expect(fakeAdapter.setInterval.called).to.be.true;
    });

    it('legt einen neuen Timer an wenn timerIndex noch nicht in obj.timers ist', async () => {
        await timerAdd(newTimer);
        expect(fakeAdapter.log.debug.called).to.be.true;
        expect(Object.keys(obj.timers)).to.have.length.greaterThan(0);
    });

    it('startet das writeStateInterval', async () => {
        await timerAdd(newTimer);
        expect(store.writeStateInterval).to.not.be.null;
    });

    it('fängt Fehler in timerAdd ab (catch-Pfad)', async () => {
        const consoleStub = sinon.stub(console, 'log');
        fakeAdapter.setObjectNotExistsAsync = sinon.stub().rejects(new Error('createStates error'));
        await timerAdd(newTimer);
        expect(consoleStub.called).to.be.true;
        consoleStub.restore();
    });
});

describe('startTimer', () => {
    let fakeAdapter: ReturnType<typeof makeFakeAdapter>;
    let savedTimers: any;
    let savedStatus: any;
    let savedInterval: any;

    beforeEach(() => {
        fakeAdapter = makeFakeAdapter();
        (store as any).adapter = fakeAdapter;
        (store as any).localeActiveTimerList = {};
        savedTimers = { ...obj.timers };
        savedStatus = { ...obj.status };
        savedInterval = { ...obj.interval };
        obj.timers = {};
        obj.interval = { timer1: null };
    });

    afterEach(() => {
        obj.timers = savedTimers;
        obj.status = savedStatus;
        obj.interval = savedInterval;
        (store as any).adapter = {};
        (store as any).localeActiveTimerList = {};
        sinon.restore();
    });

    it('initialisiert den Timer und startet das Intervall', async () => {
        await startTimer(newTimer);
        expect(fakeAdapter.getForeignStateAsync.called).to.be.true;
        expect(fakeAdapter.setInterval.called).to.be.true;
    });

    it('setzt den richtigen timerIndex in obj.status', async () => {
        await startTimer(newTimer);
        const activeIndex = Object.keys(obj.status).find(k => obj.status[k]);
        expect(activeIndex).to.not.be.undefined;
    });

    it('startet singleInstance-Intervall wenn Timer kürzer als 1 Minute ist', async () => {
        const shortTimer: AlexaActiveTimerList = {
            id: 'short-id',
            label: null,
            triggerTime: Date.now() + 30_000,
            durationMillis: 30_000, // 30s → calculatedSeconds=30 → isMoreThanAMinute=false
        };
        await startTimer(shortTimer);
        expect(fakeAdapter.setInterval.called).to.be.true;
    });

    it('fängt Fehler in startTimer ab (catch-Pfad)', async () => {
        const consoleStub = sinon.stub(console, 'log');
        fakeAdapter.getForeignStateAsync = sinon.stub().rejects(new Error('network error'));
        await startTimer(newTimer);
        expect(consoleStub.called).to.be.true;
        consoleStub.restore();
    });
});
