import { expect } from 'chai';
import { parseTimeInput } from '@/lib/parse-time-input';
import sinon from 'sinon';
import store from '@/store/store';
import { secToHourMinSec } from '@/lib/time';

describe('Timer inputValue to evaluate string', () => {
    it('should correct simple timer', () => {
        const input = ['timer', '5', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(5)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 2', () => {
        const input = ['timer', '59', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(59)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 3', () => {
        const input = ['timer', 'drei', 'stunden', 'siebzehn', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(3)*3600+(17)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 4', () => {
        const input = ['timer', '1', 'stunde', '59', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1)*3600+(59)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 5', () => {
        const input = ['timer', 'zwei', 'hundert', 'minuten'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(2*100)*60', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 6', () => {
        const input = ['timer', 'vier', 'hundert', 'vier', 'minuten', 'zehn', 'sekunden'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(4*100+4)*60+(10)', name: '', deleteVal: 0 });
    });

    it('should correct simple timer 7', () => {
        const input = ['timer', 'fünf', 'und', 'zwanzig', 'sekunden'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(5+20)', name: '', deleteVal: 0 });
    });

    it('should correct timer with fraction 3/4 1', () => {
        const input = ['timer', 'dreiviertel', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1*0.75)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer with fraction 3/4 2', () => {
        const input = ['timer', 'dreiviertelstunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1*0.75)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer with fraction 1/2 1', () => {
        const input = ['timer', 'halbe', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer with fraction 1/2 1', () => {
        const input = ['timer', 'ein', 'ein', 'halb', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1+1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer 2,5 hours', () => {
        const input = ['timer', 'zwei', 'ein', 'halb', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(2+1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer 8,5 hours', () => {
        const input = ['timer', 'acht', 'ein', 'halb', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(8+1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer 2,75 hours', () => {
        const input = ['timer', 'zwei', 'dreiviertel', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(2+0.75)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer 2,75 hours and name', () => {
        const input = ['Brot', 'timer', 'drei', 'dreiviertel', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(3+0.75)*3600', name: 'brot', deleteVal: 0 });
    });

    it('should correct timer for quarter hour', () => {
        const input = ['timer', 'eine', 'viertel', 'stunde'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1*0.25)*3600', name: '', deleteVal: 0 });
    });

    it('should correct timer half hour', () => {
        const input = ['timer', 'halb'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1*0.5)*3600', name: '', deleteVal: 0 });
    });

    it('should correct simple timer, with uppercase words', () => {
        const input = ['Timer', '1', 'STUNDE', '59', 'minuTen'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1)*3600+(59)*60', name: '', deleteVal: 0 });
    });

    it('should Name and timer values ', () => {
        const input = ['brot', 'timer', 'eine', 'stunde', 'zehn', 'minuten', 'fünf', 'und', 'dreißig', 'sekunden'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(1)*3600+(10)*60+(5+30)', name: 'brot', deleteVal: 0 });
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
        expect(res).to.be.deep.equal({ stringToEvaluate: '(3)*3600+(3+30)*60+(7+40)', name: 'fleisch', deleteVal: 0 });
    });

    it('should Name another timer with name and values', () => {
        const input = ['timer', 'fünf', 'stunden', 'neun', 'und', 'fünfzig', 'minuten', 'dreizehn', 'sekunden'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(5)*3600+(9+50)*60+(13)', name: '', deleteVal: 0 });
    });

    it('should Name another timer with name and values', () => {
        const input = ['timer', 'hundert', 'zwanzig', 'minuten', 'zwölf', 'sekunden'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ stringToEvaluate: '(100+20)*60+(12)', name: '', deleteVal: 0 });
    });
});

describe('Timer with mock', () => {
    beforeEach(() => {
        sinon.stub(store, 'isDeleteTimer').returns(true);
        sinon.stub(store, 'isShortenTimer').returns(false);
        sinon.stub(store, 'isExtendTimer').returns(false);
    });

    afterEach(() => {
        sinon.restore(); // stellt alle Stubs wieder her
    });

    it('remove one timer', () => {
        const input = ['stop', 'pommes', 'timer'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ name: 'pommes', stringToEvaluate: '', deleteVal: 1 });
    });

    it('remove all timer', () => {
        const input = ['stop', 'alle', 'timer'];
        const res = parseTimeInput(input);
        expect(res).to.be.deep.equal({ name: '', stringToEvaluate: '', deleteVal: 2 });
    });
});

describe('Timer evaluate string to Output string with units', () => {
    const tests = [
        {
            s: '(5+20)',
            e: '25 Sekunden',
            doubleInt: '25 Sekunden',
            initial: '25 Sekunden',
            doubleInitial: '25 Sekunden',
        },
        {
            s: '(5)*60',
            e: '5 Minuten 0 Sekunden',
            doubleInt: '05 Minuten 00 Sekunden',
            initial: '5 Minuten',
            doubleInitial: '05 Minuten',
        },
        {
            s: '(59)*60',
            e: '59 Minuten 0 Sekunden',
            doubleInt: '59 Minuten 00 Sekunden',
            initial: '59 Minuten',
            doubleInitial: '59 Minuten',
        },
        {
            s: '(3)*3600+(17)*60',
            e: '3 Stunden 17 Minuten 0 Sekunden',
            doubleInt: '03 Stunden 17 Minuten 00 Sekunden',
            initial: '3 Stunden 17 Minuten',
            doubleInitial: '03 Stunden 17 Minuten',
        },
        {
            s: '(1)*3600+(59)*60',
            e: '1 Stunde 59 Minuten 0 Sekunden',
            doubleInt: '01 Stunde 59 Minuten 00 Sekunden',
            initial: '1 Stunde 59 Minuten',
            doubleInitial: '01 Stunde 59 Minuten',
        },
        {
            s: '(2*100)*60',
            e: '3 Stunden 20 Minuten 0 Sekunden',
            doubleInt: '03 Stunden 20 Minuten 00 Sekunden',
            initial: '3 Stunden 20 Minuten',
            doubleInitial: '03 Stunden 20 Minuten',
        },
        {
            s: '(4*100+4)*60+(10)',
            e: '6 Stunden 44 Minuten 10 Sekunden',
            doubleInt: '06 Stunden 44 Minuten 10 Sekunden',
            initial: '6 Stunden 44 Minuten 10 Sekunden',
            doubleInitial: '06 Stunden 44 Minuten 10 Sekunden',
        },
        {
            s: '(1*0.75)*3600',
            e: '45 Minuten 0 Sekunden',
            doubleInt: '45 Minuten 00 Sekunden',
            initial: '45 Minuten',
            doubleInitial: '45 Minuten',
        },
        {
            s: '(1*0.75)*3600',
            e: '45 Minuten 0 Sekunden',
            doubleInt: '45 Minuten 00 Sekunden',
            initial: '45 Minuten',
            doubleInitial: '45 Minuten',
        },
        {
            s: '(1*0.5)*3600',
            e: '30 Minuten 0 Sekunden',
            doubleInt: '30 Minuten 00 Sekunden',
            initial: '30 Minuten',
            doubleInitial: '30 Minuten',
        },
        {
            s: '(1+1*0.5)*3600',
            e: '1 Stunde 30 Minuten 0 Sekunden',
            doubleInt: '01 Stunde 30 Minuten 00 Sekunden',
            initial: '1 Stunde 30 Minuten',
            doubleInitial: '01 Stunde 30 Minuten',
        },
        {
            s: '(2+1*0.5)*3600',
            e: '2 Stunden 30 Minuten 0 Sekunden',
            doubleInt: '02 Stunden 30 Minuten 00 Sekunden',
            initial: '2 Stunden 30 Minuten',
            doubleInitial: '02 Stunden 30 Minuten',
        },
        {
            s: '(100+20)*60+(12)',
            e: '2 Stunden 0 Minuten 12 Sekunden',
            doubleInt: '02 Stunden 00 Minuten 12 Sekunden',
            initial: '2 Stunden 12 Sekunden',
            doubleInitial: '02 Stunden 12 Sekunden',
        },
        {
            s: '(5)*3600+(9+50)*60+(13)',
            e: '5 Stunden 59 Minuten 13 Sekunden',
            doubleInt: '05 Stunden 59 Minuten 13 Sekunden',
            initial: '5 Stunden 59 Minuten 13 Sekunden',
            doubleInitial: '05 Stunden 59 Minuten 13 Sekunden',
        },
        {
            s: '(1)*3600+(10)*60+(5+30)',
            e: '1 Stunde 10 Minuten 35 Sekunden',
            doubleInt: '01 Stunde 10 Minuten 35 Sekunden',
            initial: '1 Stunde 10 Minuten 35 Sekunden',
            doubleInitial: '01 Stunde 10 Minuten 35 Sekunden',
        },
        {
            s: '(1)*3600+(59)*60',
            e: '1 Stunde 59 Minuten 0 Sekunden',
            doubleInt: '01 Stunde 59 Minuten 00 Sekunden',
            initial: '1 Stunde 59 Minuten',
            doubleInitial: '01 Stunde 59 Minuten',
        },
        {
            s: '(1*0.5)*3600',
            e: '30 Minuten 0 Sekunden',
            doubleInt: '30 Minuten 00 Sekunden',
            initial: '30 Minuten',
            doubleInitial: '30 Minuten',
        },
        {
            s: '(1*0.25)*3600',
            e: '15 Minuten 0 Sekunden',
            doubleInt: '15 Minuten 00 Sekunden',
            initial: '15 Minuten',
            doubleInitial: '15 Minuten',
        },
        {
            s: '(3+0.75)*3600',
            e: '3 Stunden 45 Minuten 0 Sekunden',
            doubleInt: '03 Stunden 45 Minuten 00 Sekunden',
            initial: '3 Stunden 45 Minuten',
            doubleInitial: '03 Stunden 45 Minuten',
        },
        {
            s: '(2+0.75)*3600',
            e: '2 Stunden 45 Minuten 0 Sekunden',
            doubleInt: '02 Stunden 45 Minuten 00 Sekunden',
            initial: '2 Stunden 45 Minuten',
            doubleInitial: '02 Stunden 45 Minuten',
        },
        {
            s: '(8+1*0.5)*3600',
            e: '8 Stunden 30 Minuten 0 Sekunden',
            doubleInt: '08 Stunden 30 Minuten 00 Sekunden',
            initial: '8 Stunden 30 Minuten',
            doubleInitial: '08 Stunden 30 Minuten',
        },
    ];
    tests.forEach((test, index) => {
        it(`should be valid for Index ${index}`, () => {
            expect(secToHourMinSec(eval(test.s), false).string).to.be.equal(test.e);
        });
        it(`should be valid for Index ${index} and 0 values are ignored `, () => {
            expect(secToHourMinSec(eval(test.s), false).initialString).to.be.equal(test.initial);
        });
    });

    tests.forEach((test, index) => {
        it(`should be valid for Index ${index} with double int`, () => {
            expect(secToHourMinSec(eval(test.s), true).string).to.be.equal(test.doubleInt);
        });
        it(`should be valid for Index ${index} with double int, and 0 values are ignored`, () => {
            expect(secToHourMinSec(eval(test.s), true).initialString).to.be.equal(test.doubleInitial);
        });
    });
});
