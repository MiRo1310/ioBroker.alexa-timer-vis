import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import { parseJSON } from '@/lib/json';
import { errorLogger } from '@/lib/logging';
import store from '@/app/store';

describe('parseJSON', () => {
    let sendStub: sinon.SinonStub;

    beforeEach(() => {
        sendStub = sinon.stub(errorLogger, 'send');
        (store.adapter as any) = false;
    });

    afterEach(() => {
        sendStub.restore();
        (store.adapter as any) = false;
    });

    it('parst gültiges JSON und liefert isValidJson = true', () => {
        const input = '{"a":1}';
        const res = parseJSON<{ a: number }>(input);
        expect(res.isValidJson).to.be.true;
        expect(res.ob).to.deep.equal({ a: 1 });
    });

    it('liefert isValidJson = false und leeren String bei null', () => {
        const res = parseJSON(null);
        expect(res.isValidJson).to.be.false;
        expect(res.ob).to.equal('');
    });

    it('liefert isValidJson = false für leeren String', () => {
        const res = parseJSON('');
        expect(res.isValidJson).to.be.false;
    });

    it('liefert isValidJson = false für ungültiges JSON (error-Pfad, adapter falsy)', () => {
        const res = parseJSON('{ kein json }');
        expect(res.isValidJson).to.be.false;
        expect(res.ob).to.equal('{ kein json }');
        expect(sendStub.called).to.be.false;
    });

    it('ruft errorLogger.send bei ungültigem JSON auf wenn adapter truthy ist', () => {
        (store as any).adapter = {};
        const res = parseJSON('{ kein json }');
        expect(res.isValidJson).to.be.false;
        expect(sendStub.calledOnce).to.be.true;
        (store as any).adapter = false;
    });
});
