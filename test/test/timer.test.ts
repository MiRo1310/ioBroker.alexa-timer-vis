import { expect } from 'chai';
import { parseTimeInput } from '@/lib/parse-time-input';
import * as storeModule from '@/store/store';
import sinon from 'sinon';
import type { Store } from '@/types/types';

describe('Timer inputValue to evaluate string', () => {
    it('should correct simple timer', () => {
        const input = ['timer', '5', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(5)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 2', () => {
        const input = ['timer', '59', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(59)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 3', () => {
        const input = ['timer', 'drei', 'stunden', 'siebzehn', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(3)*3600+(17)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 4', () => {
        const input = ['timer', '1', 'stunde', '59', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(1)*3600+(59)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 5', () => {
        const input = ['timer', 'zwei', 'hundert', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(2*100)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 6', () => {
        const input = ['timer', 'vier', 'hundert', 'vier', 'minuten', 'zehn', 'sekunden'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(4*100+4)*60+(10)', name: '', deleteVal: 0 });
    });

    it('should correct timer with fraction 3/4 1', () => {
        const input = ['timer', 'dreiviertel', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(1*0.75)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer with fraction 3/4 2', () => {
        const input = ['timer', 'dreiviertelstunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(1*0.75)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer with fraction 1/2 1', () => {
        const input = ['timer', 'halbe', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer with fraction 1/2 1', () => {
        const input = ['timer', 'ein', 'ein', 'halb', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(1+1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer 2,5 hours', () => {
        const input = ['timer', 'zwei', 'ein', 'halb', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(2+1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer 8,5 hours', () => {
        const input = ['timer', 'acht', 'ein', 'halb', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(8+1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer 2,75 hours', () => {
        const input = ['timer', 'zwei', 'dreiviertel', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(2+0.75)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer 2,75 hours and name', () => {
        const input = ['Brot', 'timer', 'drei', 'dreiviertel', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(3+0.75)*3600', name: 'brot', deleteVal: 0 });
    });

    it('should correct timer for quarter hour', () => {
        const input = ['timer', 'eine', 'viertel', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(1*0.25)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer half hour', () => {
        const input = ['timer', 'halb'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct simple timer, with uppercase words', () => {
        const input = ['Timer', '1', 'STUNDE', '59', 'minuTen'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(1)*3600+(59)*60', name: '', deleteVal: 0 });
    });

    it('should Name and timer values ', () => {
        const input = ['brot', 'timer', 'eine', 'stunde', 'zehn', 'minuten', 'fünf', 'und', 'dreißig', 'sekunden'];
        const res = parseTimeInput(input);
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
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(3)*3600+(3+30)*60+(7+40)', name: 'fleisch', deleteVal: 0 });
    });

    it('should Name another timer with name and values', () => {
        const input = ['timer', 'fünf', 'stunden', 'neun', 'und', 'fünfzig', 'minuten', 'dreizehn', 'sekunden'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ timerString: '(5)*3600+(9+50)*60+(13)', name: '', deleteVal: 0 });
    });

    it('should Name another timer with name and values', () => {
        const input = ['timer', 'hundert', 'zwanzig', 'minuten', 'zwölf', 'sekunden'];
        const res = parseTimeInput(input);
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
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ name: 'pommes', timerString: '', deleteVal: 1 });
    });

    it('remove all timer', () => {
        stub.returns({
            isDeleteTimer: () => true,
            isShortenTimer: () => false,
            isExtendTimer: () => false,
        } as Store);

        const input = ['stop', 'alle', 'timer'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ name: '', timerString: '', deleteVal: 2 });
    });
});
