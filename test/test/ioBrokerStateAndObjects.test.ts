import { expect } from 'chai';
import sinon from 'sinon';
import store from '@/app/store';
import { createStates } from '@/app/createStates';
import { initStateCreation, setDeviceNameInObject } from '@/app/ioBrokerStateAndObjects';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makeFakeAdapter = () => ({
    log: { debug: sinon.stub(), warn: sinon.stub(), info: sinon.stub(), error: sinon.stub() },
    setState: sinon.stub().resolves(),
    setObjectNotExistsAsync: sinon.stub().resolves(),
    subscribeForeignStates: sinon.stub(),
    extendObject: sinon.stub(),
    instance: 0,
});

describe('createStates', () => {
    let fakeAdapter: ReturnType<typeof makeFakeAdapter>;

    beforeEach(() => {
        fakeAdapter = makeFakeAdapter();
        (store as any).adapter = fakeAdapter;
    });

    afterEach(() => {
        (store as any).adapter = {};
        sinon.restore();
    });

    it('erstellt all_Timer.alive und alle Timer-States für n=1', async () => {
        await createStates(1);
        // 1 for all_Timer.alive + 16 per timer × 1 timer = 17
        expect(fakeAdapter.setObjectNotExistsAsync.callCount).to.equal(17);
    });

    it('subscribed die Reset-States pro Timer', async () => {
        await createStates(2);
        expect(fakeAdapter.subscribeForeignStates.callCount).to.equal(2);
    });

    it('erstellt keine doppelten States wenn n=0', async () => {
        await createStates(0);
        expect(fakeAdapter.setObjectNotExistsAsync.callCount).to.equal(1);
    });

    it('fängt Fehler in createStates ab (catch-Pfad)', async () => {
        const consoleStub = sinon.stub(console, 'log');
        fakeAdapter.setObjectNotExistsAsync = sinon.stub().rejects(new Error('DB Error'));
        await createStates(1);
        expect(consoleStub.called).to.be.true;
        consoleStub.restore();
    });
});

describe('initStateCreation', () => {
    let fakeAdapter: ReturnType<typeof makeFakeAdapter>;

    beforeEach(() => {
        fakeAdapter = makeFakeAdapter();
        (store as any).adapter = fakeAdapter;
    });

    afterEach(() => {
        (store as any).adapter = {};
        sinon.restore();
    });

    it('loggt debug, setzt connection state und erstellt States', async () => {
        await initStateCreation();
        expect(fakeAdapter.log.debug.calledOnce).to.be.true;
        expect(fakeAdapter.setState.calledWith('info.connection', true, true)).to.be.true;
        expect(fakeAdapter.setObjectNotExistsAsync.called).to.be.true;
    });
});

describe('setDeviceNameInObject', () => {
    afterEach(() => {
        (store as any).adapter = {};
        sinon.restore();
    });

    it('gibt früh zurück wenn index leer ist', async () => {
        const extendStub = sinon.stub();
        (store as any).adapter = { extendObject: extendStub };
        await setDeviceNameInObject('', 'val');
        expect(extendStub.called).to.be.false;
    });

    it('ruft extendObject auf und resolves bei erfolgreicher Ausführung', async () => {
        (store as any).alexaTimerVisInstance = '';
        (store as any).adapter = {
            extendObject: sinon.stub().callsFake((_p: any, _o: any, cb: any) => cb(null)),
        };
        await setDeviceNameInObject('timer1', 'EchoDot');
    });

    it('ruft errorLogger auf wenn extendObject mit Fehler zurückruft', async () => {
        const logStub = sinon.stub(console, 'log');
        (store as any).alexaTimerVisInstance = '';
        (store as any).adapter = {
            extendObject: sinon.stub().callsFake((_p: any, _o: any, cb: any) => cb(new Error('DB Error'))),
        };
        await setDeviceNameInObject('timer1', 'EchoDot');
        expect(logStub.called).to.be.true;
        logStub.restore();
    });
});
