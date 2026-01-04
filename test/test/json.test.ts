// test/json.spec.ts
import { expect } from 'chai';
import sinon from 'sinon';
import { parseJSON } from '@/lib/json';
import errorLogger from '@/lib/logging';
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
});
