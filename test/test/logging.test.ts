import { expect } from 'chai';
import sinon from 'sinon';
import { errorLogger } from '@/lib/logging';
import store from '@/app/store';

describe('ErrorLoggerClass.iobrokerLogging', () => {
    afterEach(() => {
        (errorLogger as any).adapter = undefined;
        (store as any).adapter = {};
        sinon.restore();
    });

    it('nutzt console.log wenn kein Adapter-Log gesetzt ist', () => {
        (errorLogger as any).adapter = undefined;
        const logStub = sinon.stub(console, 'log');
        errorLogger.iobrokerLogging('Fehler', new Error('test'));
        expect(logStub.calledOnce).to.be.true;
    });

    it('nutzt adapter.log.error wenn Adapter gesetzt ist', () => {
        const errorStub = sinon.stub();
        (errorLogger as any).adapter = { log: { error: errorStub } };
        errorLogger.iobrokerLogging('Titel', new Error('test-msg'));
        expect(errorStub.called).to.be.true;
        expect(errorStub.calledWith('Titel')).to.be.true;
    });

    it('loggt server response wenn e.response gesetzt ist', () => {
        const errorStub = sinon.stub();
        (errorLogger as any).adapter = { log: { error: errorStub } };
        const err = { message: 'msg', stack: 'stack', response: { status: 500, statusText: 'ISE' } };
        errorLogger.iobrokerLogging('Titel', err);
        expect(errorStub.callCount).to.equal(5);
    });

    it('loggt nur 3 Fehlermeldungen wenn kein e.response', () => {
        const errorStub = sinon.stub();
        (errorLogger as any).adapter = { log: { error: errorStub } };
        errorLogger.iobrokerLogging('Titel', { message: 'msg', stack: 'stack' });
        expect(errorStub.callCount).to.equal(3);
    });
});

describe('ErrorLoggerClass.send', () => {
    afterEach(() => {
        (errorLogger as any).adapter = undefined;
        (errorLogger as any).Sentry = undefined;
        sinon.restore();
    });

    it('ruft iobrokerLogging auf (kein Adapter → console.log)', () => {
        const logStub = sinon.stub(console, 'log');
        errorLogger.send({ title: 'Fehler', e: new Error('x') });
        expect(logStub.calledOnce).to.be.true;
    });

    it('ruft sendErrorToSentry auf wenn nur e übergeben wird', () => {
        const logStub = sinon.stub(console, 'log');
        const captureStub = sinon.stub();
        (errorLogger as any).Sentry = { captureException: captureStub };
        errorLogger.send({ title: 'Fehler', e: new Error('x') });
        expect(captureStub.calledOnce).to.be.true;
        logStub.restore();
    });

    it('ruft sendMessageToSentry auf wenn additionalInfos übergeben werden', () => {
        const logStub = sinon.stub(console, 'log');
        const withScopeStub = sinon.stub().callsFake((cb: any) => {
            cb({ setLevel: sinon.stub(), setExtra: sinon.stub() });
        });
        const captureMessageStub = sinon.stub();
        (errorLogger as any).Sentry = { withScope: withScopeStub, captureMessage: captureMessageStub };
        errorLogger.send({ title: 'Info', e: new Error('x'), additionalInfos: [['key', 'val']] });
        expect(withScopeStub.calledOnce).to.be.true;
        expect(captureMessageStub.calledOnce).to.be.true;
        logStub.restore();
    });

    it('captureMessage wird aufgerufen auch wenn kein e in additionalInfos', () => {
        const logStub = sinon.stub(console, 'log');
        const captureMessageStub = sinon.stub();
        (errorLogger as any).Sentry = {
            withScope: sinon.stub().callsFake((cb: any) => {
                cb({ setLevel: sinon.stub(), setExtra: sinon.stub() });
            }),
            captureMessage: captureMessageStub,
        };
        errorLogger.send({ title: 'Info', additionalInfos: [['k', 'v']] });
        expect(captureMessageStub.calledOnce).to.be.true;
        logStub.restore();
    });
});

describe('ErrorLoggerClass.init', () => {
    afterEach(() => {
        (errorLogger as any).adapter = undefined;
        (errorLogger as any).Sentry = undefined;
        (store as any).adapter = {};
        sinon.restore();
    });

    it('setzt den Adapter aus dem Store', () => {
        const fakeAdapter = { supportsFeature: sinon.stub().returns(false) } as any;
        (store as any).adapter = fakeAdapter;
        errorLogger.init();
        expect((errorLogger as any).adapter).to.equal(fakeAdapter);
    });

    it('setzt Sentry wenn Plugin vorhanden ist', () => {
        const fakeSentryObj = { captureException: sinon.stub() };
        (store as any).adapter = {
            supportsFeature: sinon.stub().returns(true),
            getPluginInstance: sinon.stub().returns({ getSentryObject: () => fakeSentryObj }),
        } as any;
        errorLogger.init();
        expect((errorLogger as any).Sentry).to.equal(fakeSentryObj);
    });

    it('setzt Sentry nicht wenn Plugin null zurückgibt', () => {
        (store as any).adapter = {
            supportsFeature: sinon.stub().returns(true),
            getPluginInstance: sinon.stub().returns(null),
        } as any;
        errorLogger.init();
        expect((errorLogger as any).Sentry).to.be.undefined;
    });
});
