import { expect } from 'chai';
import sinon from 'sinon';
import { secToHourMinSec, millisecondsToString } from '@/lib/time';
import { getAvailableTimerIndex } from '@/app/timer-start';
import * as timerData from '@/config/timer-data'; // import namespace, damit wir exportierte Werte ändern können
import { Timer, getTimerByIndex, getTimerById } from '@/app/timer';
import store from '@/app/store';
import { generateTimerValues } from '@/app/generate-timer-values';
import { obj } from '@/config/timer-data';

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
            expect(secToHourMinSec(eval(test.s), false).stringTimer).to.be.equal(test.e);
        });
        it(`should be valid for Index ${index} and 0 values are ignored `, () => {
            expect(secToHourMinSec(eval(test.s), false).initialString).to.be.equal(test.initial);
        });
    });

    tests.forEach((test, index) => {
        it(`should be valid for Index ${index} with double int`, () => {
            expect(secToHourMinSec(eval(test.s), true).stringTimer).to.be.equal(test.doubleInt);
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
        sinon.stub(timerData.obj, 'status').value({
            timer1: false,
            timer2: true,
            timer3: true,
            timer4: true,
        });

        expect(getAvailableTimerIndex()).to.equal('timer1');
    });

    it('should get a free timerIndex 2', () => {
        sinon.stub(timerData.obj, 'status').value({
            timer1: true,
            timer2: false,
            timer3: true,
            timer4: false,
        });

        expect(getAvailableTimerIndex()).to.equal('timer2');
    });

    it('should get a free timerIndex 3', () => {
        sinon.stub(timerData.obj, 'status').value({
            timer1: true,
            timer2: true,
            timer3: true,
            timer4: true,
        });

        expect(getAvailableTimerIndex()).to.equal('timer5');
    });

    it('should get a free timerIndex with invalid key 3', () => {
        sinon.stub(timerData.obj, 'status').value({
            timer1: true,
            timer2: true,
            timer3: true,
            timer4: true,
            '': false,
        });

        expect(getAvailableTimerIndex()).to.equal('timer5');
    });
});

describe('Timer.extendTimer', () => {
    let timer: Timer;

    beforeEach(() => {
        timer = new Timer({ store });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('setzt extendOrShortenTimer auf true', () => {
        timer.extendTimer(60_000);
        expect(timer.isExtendOrShortenTimer()).to.be.true;
    });

    it('erhöht endTime um die übergebenen Millisekunden', () => {
        (timer as any).endTime = 1_000_000;
        timer.extendTimer(60_000);
        expect((timer as any).endTime).to.equal(1_060_000);
    });

    it('erhöht remainingTimeInSeconds um die Sekunden', () => {
        (timer as any).remainingTimeInSeconds = 120;
        timer.extendTimer(30_000);
        expect((timer as any).remainingTimeInSeconds).to.equal(150);
    });

    it('erhöht voiceInputAsSeconds um die Sekunden', () => {
        (timer as any).voiceInputAsSeconds = 300;
        timer.extendTimer(60_000);
        expect((timer as any).voiceInputAsSeconds).to.equal(360);
    });

    it('aktualisiert endTimeString korrekt', () => {
        const initialEndTime = 3_600_000;
        const extensionMs = 60_000;
        (timer as any).endTime = initialEndTime;
        timer.extendTimer(extensionMs);
        expect((timer as any).endTimeString).to.equal(millisecondsToString(initialEndTime + extensionMs));
    });

    it('aktualisiert initialTimer basierend auf calculatedSeconds + Sekunden', () => {
        (timer as any).calculatedSeconds = 300; // 5 Minuten
        timer.extendTimer(60_000); // +1 Minute = 360 Sekunden
        expect((timer as any).initialTimer).to.equal('06 Minuten');
    });

    it('setzt extendOrShortenTimer bei mehrfachem Aufruf weiterhin auf true', () => {
        timer.extendTimer(10_000);
        timer.extendTimer(20_000);
        expect(timer.isExtendOrShortenTimer()).to.be.true;
    });

    it('addiert Verlängerungen akkumuliert', () => {
        (timer as any).endTime = 1_000_000;
        (timer as any).remainingTimeInSeconds = 200;
        timer.extendTimer(30_000);
        timer.extendTimer(30_000);
        expect((timer as any).endTime).to.equal(1_060_000);
        expect((timer as any).remainingTimeInSeconds).to.equal(260);
    });

    it('verkürzt den Timer bei negativen Millisekunden', () => {
        (timer as any).endTime = 1_000_000;
        (timer as any).remainingTimeInSeconds = 300;
        (timer as any).voiceInputAsSeconds = 300;
        (timer as any).calculatedSeconds = 300; // 5 Minuten
        timer.extendTimer(-60_000); // -1 Minute
        expect((timer as any).endTime).to.equal(940_000);
        expect((timer as any).remainingTimeInSeconds).to.equal(240);
        expect((timer as any).voiceInputAsSeconds).to.equal(240);
        expect((timer as any).initialTimer).to.equal('04 Minuten');
    });
});

describe('Timer Getter und Setter', () => {
    let timer: Timer;

    beforeEach(() => {
        timer = new Timer({ store });
    });

    it("getTimerIndex gibt '' nach Konstruktor zurück", () => {
        expect(timer.getTimerIndex()).to.equal('');
    });

    it('getInterval gibt 1000 nach Konstruktor zurück', () => {
        expect(timer.getInterval()).to.equal(1000);
    });

    it("getTimerId gibt '' nach Konstruktor zurück", () => {
        expect(timer.getTimerId()).to.equal('');
    });

    it('isActive ist false nach Konstruktor', () => {
        expect(timer.isActive).to.be.false;
    });

    it('setInactive setzt isActive auf false', () => {
        (timer as any)._isActive = true;
        timer.setInactive();
        expect(timer.isActive).to.be.false;
    });

    it('setVoiceInputAsSeconds setzt den Wert korrekt', () => {
        timer.setVoiceInputAsSeconds(120);
        expect((timer as any).voiceInputAsSeconds).to.equal(120);
    });

    it('setLengthTimer setzt den Wert korrekt', () => {
        timer.setLengthTimer('5 Minuten');
        expect((timer as any).lengthTimer).to.equal('5 Minuten');
    });

    it('setInterval setzt den Wert korrekt', () => {
        timer.setIntervalMs(500);
        expect(timer.getInterval()).to.equal(500);
    });

    it('setCreationTime setzt creationTime und berechnet creationTimeString', () => {
        const ms = 3_600_000;
        timer.setCreationTime(ms);
        expect((timer as any).creationTime).to.equal(ms);
        expect((timer as any).creationTimeString).to.equal(millisecondsToString(ms));
    });
});

describe('Timer.outPutTimerName', () => {
    let timer: Timer;

    beforeEach(() => {
        timer = new Timer({ store });
    });

    it("gibt 'Timer' zurück für leeren Namen", () => {
        (timer as any).timerName = '';
        expect(timer.outPutTimerName()).to.equal('Timer');
    });

    it("gibt 'Timer' zurück wenn Name 'Timer' ist", () => {
        (timer as any).timerName = 'Timer';
        expect(timer.outPutTimerName()).to.equal('Timer');
    });

    it("gibt formatierten Namen zurück für 'pizza'", () => {
        (timer as any).timerName = 'pizza';
        expect(timer.outPutTimerName()).to.equal('Pizza Timer');
    });

    it("gibt formatierten Namen zurück für 'küchen'", () => {
        (timer as any).timerName = 'küchen';
        expect(timer.outPutTimerName()).to.equal('Küchen Timer');
    });
});

describe('Timer.getOutputProperties', () => {
    it('gibt alle 13 Felder mit Initialwerten zurück', () => {
        const timer = new Timer({ store });
        const props = timer.getOutputProperties();
        expect(props).to.have.all.keys(
            'hours',
            'minutes',
            'seconds',
            'stringTimer1',
            'stringTimer2',
            'startTimeString',
            'endTimeNumber',
            'endTimeString',
            'inputDevice',
            'lengthTimer',
            'percent',
            'percent2',
            'initialTimer',
        );
        expect(props.endTimeNumber).to.equal(0);
        expect(props.percent).to.equal(0);
        expect(props.percent2).to.equal(0);
    });
});

describe('Timer.getDataAsJson', () => {
    it('gibt valides JSON zurück', () => {
        const timer = new Timer({ store });
        const json = timer.getDataAsJson();
        expect(() => JSON.parse(json)).to.not.throw();
    });

    it('enthält alle erwarteten Keys', () => {
        const timer = new Timer({ store });
        const parsed = JSON.parse(timer.getDataAsJson());
        for (const key of [
            'name',
            'hours',
            'minutes',
            'seconds',
            'voiceInputAsSeconds',
            'stringTimer1',
            'stringTimer2',
            'creationTime',
            'creationTimeString',
            'endTimeNumber',
            'endTimeString',
            'inputDevice',
            'serialNumber',
            'interval',
            'lengthTimer',
            'percent',
            'percent2',
            'remainingTimeInSeconds',
            'timerId',
        ]) {
            expect(parsed).to.have.property(key);
        }
    });
});

describe('Timer.setTimerValues + mathPercent', () => {
    let timer: Timer;

    beforeEach(() => {
        timer = new Timer({ store });
    });

    it('setzt isActive auf true', () => {
        timer.setVoiceInputAsSeconds(300);
        timer.setTimerValues({
            hours: '0',
            minutes: '5',
            seconds: '0',
            stringTimer1: '',
            stringTimer2: '',
            remainingSeconds: 300,
            lengthTimer: '',
        });
        expect(timer.isActive).to.be.true;
    });

    it('setzt alle Felder korrekt', () => {
        timer.setVoiceInputAsSeconds(600);
        timer.setTimerValues({
            hours: '1',
            minutes: '2',
            seconds: '3',
            stringTimer1: 's1',
            stringTimer2: 's2',
            remainingSeconds: 300,
            lengthTimer: 'l',
        });
        const props = timer.getOutputProperties();
        expect(props.hours).to.equal('1');
        expect(props.minutes).to.equal('2');
        expect(props.seconds).to.equal('3');
        expect(props.stringTimer1).to.equal('s1');
        expect(props.stringTimer2).to.equal('s2');
        expect(props.lengthTimer).to.equal('l');
    });

    it('percent + percent2 ergeben 100', () => {
        timer.setVoiceInputAsSeconds(300);
        timer.setTimerValues({
            hours: '0',
            minutes: '2',
            seconds: '30',
            stringTimer1: '',
            stringTimer2: '',
            remainingSeconds: 150,
            lengthTimer: '',
        });
        const props = timer.getOutputProperties();
        expect(props.percent + props.percent2).to.equal(100);
    });

    it('percent ist 0 wenn voiceInputAsSeconds 0 ist (Division durch 0 → NaN)', () => {
        timer.setVoiceInputAsSeconds(0);
        timer.setTimerValues({
            hours: '0',
            minutes: '0',
            seconds: '0',
            stringTimer1: '',
            stringTimer2: '',
            remainingSeconds: 0,
            lengthTimer: '',
        });
        expect(timer.getOutputProperties().percent).to.be.NaN;
    });
});

describe('Timer.setValuesFromEchoDeviceTimerList', () => {
    let timer: Timer;

    beforeEach(() => {
        (store as any).adapter = {
            log: { warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub(), info: sinon.stub() },
        };
        timer = new Timer({ store });
    });

    afterEach(() => {
        (store as any).adapter = {};
        sinon.restore();
    });

    it('setzt timerId, endTime und calculatedSeconds aus dem Alexa-Timer-Objekt', () => {
        timer.setValuesFromEchoDeviceTimerList({
            id: 'abc',
            triggerTime: 2_000_000,
            durationMillis: 300_000,
            label: 'Kochen',
        });
        expect(timer.getTimerId()).to.equal('abc');
        expect((timer as any).endTime).to.equal(2_000_000);
        expect(timer.calculatedSeconds).to.equal(300);
    });

    it('setzt initialTimer korrekt', () => {
        timer.setValuesFromEchoDeviceTimerList({
            id: 'x',
            triggerTime: 1_000_000,
            durationMillis: 300_000,
            label: '',
        });
        expect((timer as any).initialTimer).to.equal('05 Minuten');
    });

    it('löst log.warn aus wenn endTime vor dem Setzen negativ ist', () => {
        (timer as any).endTime = -1;
        timer.setValuesFromEchoDeviceTimerList({
            id: 'x',
            triggerTime: 1_000_000,
            durationMillis: 60_000,
            label: '',
        });
        expect((store.adapter as any).log.warn.calledOnce).to.be.true;
    });

    it('ignoriert den Aufruf wenn newActiveTimer falsy ist', () => {
        timer.setValuesFromEchoDeviceTimerList(null as any);
        expect(timer.getTimerId()).to.equal('');
    });
});

describe('getTimerByIndex / getTimerById', () => {
    let timer: Timer;
    let savedTimers: any;

    beforeEach(() => {
        savedTimers = { ...obj.timers };
        timer = new Timer({ store });
        (timer as any).timerId = 'test-id-99';
        obj.timers.timerX = timer;
    });

    afterEach(() => {
        obj.timers = savedTimers;
    });

    it('getTimerByIndex findet den Timer per Index', () => {
        expect(getTimerByIndex('timerX')).to.equal(timer);
    });

    it('getTimerByIndex gibt undefined für unbekannten Index zurück', () => {
        expect(getTimerByIndex('timerUnknown')).to.be.undefined;
    });

    it('getTimerById findet den Timer per ID', () => {
        expect(getTimerById('test-id-99')).to.equal(timer);
    });

    it('getTimerById gibt undefined für unbekannte ID zurück', () => {
        expect(getTimerById('nicht-vorhanden')).to.be.undefined;
    });
});

describe('generateTimerValues', () => {
    let timer: Timer;

    beforeEach(() => {
        (store as any).adapter = {
            log: { warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub(), info: sinon.stub() },
        };
        timer = new Timer({ store });
    });

    afterEach(() => {
        (store as any).adapter = {};
        sinon.restore();
    });

    it('gibt positive Sekunden zurück für zukünftiges endTime', () => {
        (timer as any).endTime = Date.now() + 60_000; // 60s in der Zukunft
        timer.setVoiceInputAsSeconds(60);
        const result = generateTimerValues(timer);
        expect(result).to.be.greaterThan(0);
        expect(result).to.be.lessThanOrEqual(60);
    });

    it('gibt 0 zurück wenn endTime bereits vergangen ist', () => {
        (timer as any).endTime = Date.now() - 10_000; // 10s in der Vergangenheit
        timer.setVoiceInputAsSeconds(60);
        const result = generateTimerValues(timer);
        expect(result).to.equal(0);
    });

    it('gibt 0 zurück und loggt warn wenn endTime negativ ist', () => {
        (timer as any).endTime = -1;
        const result = generateTimerValues(timer);
        expect(result).to.equal(0);
        expect((store.adapter as any).log.warn.calledOnce).to.be.true;
    });

    it('setzt voiceInputAsSeconds auf calculatedSeconds wenn isExtendOrShortenTimer false ist', () => {
        (timer as any).endTime = Date.now() + 120_000;
        (timer as any).calculatedSeconds = 120;
        timer.setVoiceInputAsSeconds(0);
        generateTimerValues(timer);
        expect((timer as any).voiceInputAsSeconds).to.equal(120);
    });

    it('setzt voiceInputAsSeconds NICHT wenn isExtendOrShortenTimer true ist', () => {
        (timer as any).endTime = Date.now() + 120_000;
        (timer as any).calculatedSeconds = 120;
        timer.extendTimer(10_000); // setzt extendOrShortenTimer = true und voiceInputAsSeconds auf 10
        const voiceBefore = (timer as any).voiceInputAsSeconds;
        generateTimerValues(timer);
        expect((timer as any).voiceInputAsSeconds).to.equal(voiceBefore);
    });
});

describe('Timer.extendTimer / isExtendOrShortenTimer', () => {
    let timer: Timer;

    beforeEach(() => {
        timer = new Timer({ store });
        (timer as any).endTime = 1_000_000;
        (timer as any).voiceInputAsSeconds = 60;
        (timer as any).remainingTimeInSeconds = 60;
        (timer as any).calculatedSeconds = 120;
    });

    it('isExtendOrShortenTimer ist initial false', () => {
        expect(timer.isExtendOrShortenTimer()).to.be.false;
    });

    it('extendTimer setzt isExtendOrShortenTimer auf true', () => {
        timer.extendTimer(5_000);
        expect(timer.isExtendOrShortenTimer()).to.be.true;
    });

    it('extendTimer erhöht endTime um die angegebenen Millisekunden', () => {
        timer.extendTimer(10_000);
        expect((timer as any).endTime).to.equal(1_010_000);
    });

    it('extendTimer erhöht voiceInputAsSeconds um die Sekunden', () => {
        timer.extendTimer(30_000);
        expect((timer as any).voiceInputAsSeconds).to.equal(90);
    });

    it('extendTimer erhöht remainingTimeInSeconds', () => {
        timer.extendTimer(20_000);
        expect((timer as any).remainingTimeInSeconds).to.equal(80);
    });

    it('extendTimer aktualisiert initialTimer', () => {
        timer.extendTimer(60_000); // +60s → calculatedSeconds 120 + 60 = 180s = 3 Minuten
        expect((timer as any).initialTimer).to.equal('03 Minuten');
    });
});

describe('Timer.reset', () => {
    let timer: Timer;

    beforeEach(() => {
        (store as any).localeActiveTimerList = {};
        timer = new Timer({ store });
        timer.setTimerValues({
            hours: '0',
            minutes: '5',
            seconds: '0',
            stringTimer1: '0:5:0 min',
            stringTimer2: '5 min',
            remainingSeconds: 300,
            lengthTimer: '5 min',
        });
        (timer as any).timerId = 'test-reset-id';
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = {};
        sinon.restore();
    });

    it('setzt _isActive auf false', async () => {
        await timer.reset();
        expect(timer.isActive).to.be.false;
    });

    it('setzt timerId auf leeren String zurück', async () => {
        await timer.reset();
        expect(timer.getTimerId()).to.equal('');
    });

    it('setzt voiceInputAsSeconds auf 0 zurück', async () => {
        (timer as any).voiceInputAsSeconds = 300;
        await timer.reset();
        expect((timer as any).voiceInputAsSeconds).to.equal(0);
    });

    it('setzt remainingTimeInSeconds auf 0 zurück', async () => {
        await timer.reset();
        expect((timer as any).remainingTimeInSeconds).to.equal(0);
    });

    it('setzt obj.status auf false wenn timerIndex gesetzt ist', async () => {
        (store as any).adapter = {
            extendObject: sinon.stub().callsFake((_p: string, _o: any, cb: (err: any) => void) => cb(null)),
            log: { warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub(), info: sinon.stub() },
        };
        (store as any).alexaTimerVisInstance = '';
        (timer as any).timerIndex = 'timer1';
        obj.status.timer1 = true;
        await timer.reset();
        expect(obj.status.timer1).to.be.false;
        (store as any).adapter = {};
    });
});

describe('Timer.stopTimerInAlexa', () => {
    let timer: Timer;

    beforeEach(() => {
        (store as any).localeActiveTimerList = {};
        timer = new Timer({ store });
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = {};
        (store as any).adapter = {};
        sinon.restore();
    });

    it('gibt früh zurück wenn alexaInstance null ist', async () => {
        (timer as any).alexaInstance = null;
        await timer.stopTimerInAlexa();
        expect(timer.isActive).to.be.false;
    });

    it('ruft setForeignState auf und setzt den Timer zurück', async () => {
        const setForeignStateStub = sinon.stub();
        (timer as any).alexaInstance = '0';
        (timer as any).deviceSerialNumber = 'ABC';
        (timer as any).timerId = 'stop-id';
        (timer as any).adapter = { setForeignState: setForeignStateStub };
        await timer.stopTimerInAlexa();
        expect(setForeignStateStub.calledOnce).to.be.true;
        expect(setForeignStateStub.calledWith('alexa2.0.Echo-Devices.ABC.Timer.stopTimerId', 'stop-id', false)).to.be
            .true;
    });
});
