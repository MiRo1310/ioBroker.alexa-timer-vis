import { expect } from 'chai';
import sinon from 'sinon';
import store from '@/app/store';
import { obj } from '@/config/timer-data';
import { Timer } from '@/app/timer';
import { writeStates, writeStatesByTimerIndex } from '@/app/write-state';
import { writeStateInterval } from '@/app/write-state-interval';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makeFakeAdapter = () => ({
    log: { debug: sinon.stub(), warn: sinon.stub(), info: sinon.stub(), error: sinon.stub() },
    getObjectAsync: sinon.stub().resolves({ type: 'state' }),
    setStateChanged: sinon.stub(),
    setInterval: sinon.stub().returns(42),
    clearInterval: sinon.stub(),
    setObjectNotExistsAsync: sinon.stub().resolves(),
    subscribeForeignStates: sinon.stub(),
});

describe('writeStatesByTimerIndex', () => {
    let fakeAdapter: ReturnType<typeof makeFakeAdapter>;
    let savedTimers: any;
    let savedStatus: any;

    beforeEach(() => {
        fakeAdapter = makeFakeAdapter();
        (store as any).adapter = fakeAdapter;
        savedTimers = { ...obj.timers };
        savedStatus = { ...obj.status };
    });

    afterEach(() => {
        obj.timers = savedTimers;
        obj.status = savedStatus;
        (store as any).adapter = {};
        sinon.restore();
    });

    it('loggt debug wenn kein Timer für den Index existiert', async () => {
        await writeStatesByTimerIndex('timerNonExistent', false);
        expect(fakeAdapter.log.debug.calledWith('No timer for timerNonExistent')).to.be.true;
    });

    it('schreibt alle States wenn Timer und Objekt existieren', async () => {
        obj.timers.timerW1 = new Timer({ store });
        obj.status.timerW1 = true;
        await writeStatesByTimerIndex('timerW1', false);
        expect(fakeAdapter.setStateChanged.called).to.be.true;
    });

    it('loggt debug wenn Objekt nicht existiert', async () => {
        fakeAdapter.getObjectAsync = sinon.stub().resolves(null);

        obj.timers.timerW2 = new Timer({ store });
        obj.status.timerW2 = true;
        await writeStatesByTimerIndex('timerW2', false);
        expect(
            fakeAdapter.log.debug.calledWith('Object for timerW2 does not exist, no reset statements will be written'),
        ).to.be.true;
        expect(fakeAdapter.setStateChanged.called).to.be.false;
    });

    it('ruft timer.reset auf wenn reset=true', async () => {
        const timer = new Timer({ store });
        (store as any).localeActiveTimerList = {};
        obj.timers.timerW3 = timer;
        obj.status.timerW3 = true;
        const resetSpy = sinon.stub(timer, 'reset').resolves();
        await writeStatesByTimerIndex('timerW3', true);
        expect(resetSpy.calledOnce).to.be.true;
    });

    it('gibt früh zurück wenn kein Adapter gesetzt ist', async () => {
        (store as any).adapter = null;
        await writeStatesByTimerIndex('timer1', false);
        // no error, early return
        (store as any).adapter = {};
    });

    it('gibt früh zurück wenn Objekt nicht existiert (zweiter Aufruf mit exist=false)', async () => {
        fakeAdapter.getObjectAsync = sinon.stub().resolves(null);
        obj.timers.timerExistFalse = new Timer({ store });
        // first call sets timerObjectStatus to { init: true, exist: false }
        await writeStatesByTimerIndex('timerExistFalse', false);
        // second call: init=true → skip init block, exist=false → early return
        await writeStatesByTimerIndex('timerExistFalse', false);
        expect(fakeAdapter.setStateChanged.called).to.be.false;
    });
});

describe('writeStates', () => {
    let fakeAdapter: ReturnType<typeof makeFakeAdapter>;
    let savedStatus: any;
    let savedTimers: any;

    beforeEach(() => {
        fakeAdapter = makeFakeAdapter();
        (store as any).adapter = fakeAdapter;
        savedStatus = { ...obj.status };
        savedTimers = { ...obj.timers };
        obj.status = { timerX: false };
        obj.timers.timerX = new Timer({ store });
    });

    afterEach(() => {
        obj.status = savedStatus;
        obj.timers = savedTimers;
        (store as any).adapter = {};
        sinon.restore();
    });

    it('iteriert über alle Timer-Indizes und schreibt States', async () => {
        await writeStates({ reset: false });
        expect(fakeAdapter.setStateChanged.called).to.be.true;
    });
});

describe('writeStateInterval', () => {
    let fakeAdapter: ReturnType<typeof makeFakeAdapter>;

    beforeEach(() => {
        fakeAdapter = makeFakeAdapter();
        (store as any).adapter = fakeAdapter;
        store.writeStateInterval = null;
    });

    afterEach(() => {
        (store as any).adapter = {};
        store.writeStateInterval = null;
        sinon.restore();
    });

    it('startet das Intervall wenn writeStateInterval null ist', () => {
        writeStateInterval();
        expect(fakeAdapter.setInterval.calledOnce).to.be.true;
        expect(store.writeStateInterval).to.equal(42);
    });

    it('startet das Intervall nicht wenn es bereits läuft', () => {
        store.writeStateInterval = 99 as unknown as ioBroker.Interval;
        writeStateInterval();
        expect(fakeAdapter.setInterval.called).to.be.false;
    });

    it('stoppt das Intervall wenn kein Timer mehr läuft (Intervall-Callback)', () => {
        let capturedCallback: (() => void) | undefined;
        fakeAdapter.setInterval = sinon.stub().callsFake((cb: () => void) => {
            capturedCallback = cb;
            return 42;
        });
        writeStateInterval();
        expect(capturedCallback).to.not.be.undefined;
        if (capturedCallback) {
            capturedCallback();
        }
        expect(fakeAdapter.clearInterval.calledOnce).to.be.true;
        expect(fakeAdapter.setStateChanged.calledWith('all_Timer.alive', false, true)).to.be.true;
    });

    it('fängt Fehler in writeStates innerhalb des Intervalls ab (catch-Pfad)', async () => {
        const consoleStub = sinon.stub(console, 'log');
        let capturedCallback: (() => void) | undefined;
        fakeAdapter.setInterval = sinon.stub().callsFake((cb: () => void) => {
            capturedCallback = cb;
            return 42;
        });
        // Reject getObjectAsync to cause writeStatesByTimerIndex to fail
        fakeAdapter.getObjectAsync = sinon.stub().rejects(new Error('DB Error'));
        const timer = new Timer({ store });
        const savedTimers = { ...obj.timers };
        const savedStatus = { ...obj.status };
        obj.timers.timerCatchErr = timer;
        obj.status.timerCatchErr = true;
        (timer as any)._isActive = true; // isSomeTimerRunning=true → stopWriteStateInterval not called
        writeStateInterval();
        if (capturedCallback) {
            capturedCallback();
        }
        await new Promise(resolve => setImmediate(resolve));
        expect(consoleStub.called).to.be.true;
        obj.timers = savedTimers;
        obj.status = savedStatus;
        consoleStub.restore();
    });
});
