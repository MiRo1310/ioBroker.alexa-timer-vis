import { expect } from 'chai';
import { filterInfo } from '@/lib/filter-info';
import * as storeModule from '@/store/store';
import sinon from 'sinon';
import type { Store } from '@/types/types';

describe('Timer', () => {
    it('should correct simple timer', () => {
        const input = ['timer', '5', 'minuten'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ timerString: '(5)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 2', () => {
        const input = ['timer', '59', 'minuten'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ timerString: '(59)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 3', () => {
        const input = ['timer', '1', 'stunde', '59', 'minuten'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ timerString: '(1)*3600+(59)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer, with uppercase words', () => {
        const input = ['Timer', '1', 'STUNDE', '59', 'minuTen'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ timerString: '(1)*3600+(59)*60', name: '', deleteVal: 0 });
    });

    it('should Name and timer values ', () => {
        const input = ['brot', 'timer', 'eine', 'stunde', 'zehn', 'minuten', 'fünf', 'und', 'dreißig', 'sekunden'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ timerString: '(1)*3600+(10)*60+(5+30)', name: 'brot', deleteVal: 0 });
    });

    it('should Name another timer with name and values', () => {
        const input = [
            'fleisch',
            'timer',
            'drei',
            'stunden',
            'drei',
            'und',
            'dreißig',
            'minuten',
            'sieben',
            'und',
            'vierzig',
            'sekunden',
        ];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ timerString: '(3)*3600+(3+30)*60+(7+40)', name: 'fleisch', deleteVal: 0 });
    });

    it('should Name another timer with name and values', () => {
        const input = ['timer', 'fünf', 'stunden', 'neun', 'und', 'fünfzig', 'minuten', 'dreizehn', 'sekunden'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ timerString: '(5)*3600+(9+50)*60+(13)', name: '', deleteVal: 0 });
    });

    it('should Name another timer with name and values', () => {
        const input = ['timer', 'hundert', 'zwanzig', 'minuten', 'zwölf', 'sekunden'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ timerString: '(100+20)*60+(12)', name: '', deleteVal: 0 });
    });
});

describe('Timer with mock', () => {
    let stub: sinon.SinonStub;

    beforeEach(() => {
        stub = sinon.stub(storeModule, 'useStore').returns({
            isDeleteTimer: () => true,
            isShortenTimer: () => false,
            isExtendTimer: () => false,
        } as Store);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('remove one timer', () => {
        const input = ['stop', 'pommes', 'timer'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ name: 'pommes', timerString: '', deleteVal: 1 });
    });

    it('remove all timer', () => {
        stub.returns({
            isDeleteTimer: () => true,
            isShortenTimer: () => false,
            isExtendTimer: () => false,
        } as Store);

        const input = ['stop', 'alle', 'timer'];
        const res = filterInfo(input);
        expect(res).to.be.deep.equal({ name: '', timerString: '', deleteVal: 2 });
    });
});
