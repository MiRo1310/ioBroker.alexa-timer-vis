import { expect } from 'chai';
import sinon from 'sinon';
import { secToHourMinSec } from '@/lib/time';
import { getAvailableTimerIndex } from '@/app/timer-start';
import * as timerData from '@/config/timer-data'; // import namespace, damit wir exportierte Werte ändern können

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
describe('startTimer (stubbed timerObject)', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should get a free timerIndex 1', () => {
        sinon.stub(timerData.timers, 'status').value({
            timer1: false,
            timer2: true,
            timer3: true,
            timer4: true,
        });

        expect(getAvailableTimerIndex()).to.equal('timer1');
    });

    it('should get a free timerIndex 2', () => {
        sinon.stub(timerData.timers, 'status').value({
            timer1: true,
            timer2: false,
            timer3: true,
            timer4: false,
        });

        expect(getAvailableTimerIndex()).to.equal('timer2');
    });

    it('should get a free timerIndex 3', () => {
        sinon.stub(timerData.timers, 'status').value({
            timer1: true,
            timer2: true,
            timer3: true,
            timer4: true,
        });

        expect(getAvailableTimerIndex()).to.equal('timer5');
    });

    it('should get a free timerIndex with invalid key 3', () => {
        sinon.stub(timerData.timers, 'status').value({
            timer1: true,
            timer2: true,
            timer3: true,
            timer4: true,
            '': false,
        });

        expect(getAvailableTimerIndex()).to.equal('timer5');
    });
});
