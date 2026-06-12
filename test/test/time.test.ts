import { expect } from 'chai';
import {
    getTimerStringUnitBasedOnTime,
    getTimeUnit,
    isMoreThanAMinute,
    millisecondsToString,
    resetSuperiorValue,
    getSecondsFromMS,
} from '@/lib/time';
import store from '@/app/store';

describe('Time Tests', () => {
    // + 1 hour
    it('should time to string 1', () => {
        expect(millisecondsToString(1765029307000)).to.be.equal('14:55:07');
    });

    it('should time to string 2', () => {
        expect(millisecondsToString(2000)).to.be.equal('01:00:02');
    });

    it('should time to string 3', () => {
        expect(millisecondsToString(41590000)).to.be.equal('12:33:10');
    });
});
let _origUnitSecond3: string;
let _origUnitMinute3: string;
let _origUnitHour3: string;
describe('Time Tests', () => {
    beforeEach(() => {
        _origUnitSecond3 = (store as any).unitSecond3;
        _origUnitMinute3 = (store as any).unitMinute3;
        _origUnitHour3 = (store as any).unitHour3;
        (store as any).unitHour3 = 'std';
        (store as any).unitMinute3 = 'min';
        (store as any).unitSecond3 = 's';
    });

    afterEach(() => {
        (store as any).unitHour3 = _origUnitHour3;
        (store as any).unitMinute3 = _origUnitMinute3;
        (store as any).unitSecond3 = _origUnitSecond3;
    });

    it('should get seconds with unit', () => {
        expect(getTimerStringUnitBasedOnTime('0', '0', '60')).to.equal('60 s');
    });

    it('should get seconds with unit', () => {
        expect(getTimerStringUnitBasedOnTime('0', '60', '5')).to.equal('60:5 min');
    });

    it('should get seconds with unit', () => {
        expect(getTimerStringUnitBasedOnTime('1', '5', '5')).to.equal('65:5 min');
    });

    it('should get seconds with unit', () => {
        expect(getTimerStringUnitBasedOnTime('1', '6', '5')).to.equal('1:6:5 std');
    });
    it('should get seconds with unit', () => {
        expect(getTimerStringUnitBasedOnTime('2', '4', '5')).to.equal('2:4:5 std');
    });
});

describe('isMoreThanAMinute', () => {
    it('gibt true zurück für mehr als 60 Sekunden', () => {
        expect(isMoreThanAMinute(61)).to.be.true;
    });

    it('gibt false zurück für genau 60 Sekunden', () => {
        expect(isMoreThanAMinute(60)).to.be.false;
    });

    it('gibt false zurück für weniger als 60 Sekunden', () => {
        expect(isMoreThanAMinute(30)).to.be.false;
    });

    it('gibt false zurück für 0 Sekunden', () => {
        expect(isMoreThanAMinute(0)).to.be.false;
    });
});

describe('resetSuperiorValue', () => {
    it("setzt hours auf '' wenn hours '00'", () => {
        const result = resetSuperiorValue('00', '15', '30');
        expect(result.hours).to.equal('');
    });

    it("behält minutes wenn hours '00' aber minutes nicht '00'", () => {
        const result = resetSuperiorValue('00', '15', '30');
        expect(result.minutes).to.equal('15');
    });

    it("setzt minutes auf '' wenn hours '00' und minutes '00'", () => {
        const result = resetSuperiorValue('00', '00', '30');
        expect(result.minutes).to.equal('');
    });

    it("setzt seconds auf '' wenn hours, minutes und seconds alle '00'", () => {
        const result = resetSuperiorValue('00', '00', '00');
        expect(result.seconds).to.equal('');
    });

    it("behält alle Werte wenn hours nicht '00'", () => {
        const result = resetSuperiorValue('01', '00', '00');
        expect(result.hours).to.equal('01');
        expect(result.minutes).to.equal('00');
        expect(result.seconds).to.equal('00');
    });
});

describe('getSecondsFromMS', () => {
    it('konvertiert 60000ms korrekt zu 60 Sekunden', () => {
        expect(getSecondsFromMS(60_000)).to.equal(60);
    });

    it('konvertiert 0ms zu 0 Sekunden', () => {
        expect(getSecondsFromMS(0)).to.equal(0);
    });

    it('rundet 1500ms auf 2 Sekunden', () => {
        expect(getSecondsFromMS(1500)).to.equal(2);
    });

    it('rundet 1499ms auf 1 Sekunde', () => {
        expect(getSecondsFromMS(1499)).to.equal(1);
    });
});

describe('getTimeUnit', () => {
    let _origUnitHour3: string;
    let _origUnitMinute3: string;
    let _origUnitSecond3: string;

    beforeEach(() => {
        _origUnitHour3 = (store as any).unitHour3;
        _origUnitMinute3 = (store as any).unitMinute3;
        _origUnitSecond3 = (store as any).unitSecond3;
        (store as any).unitHour3 = ' std';
        (store as any).unitMinute3 = ' min';
        (store as any).unitSecond3 = ' s';
    });

    afterEach(() => {
        (store as any).unitHour3 = _origUnitHour3;
        (store as any).unitMinute3 = _origUnitMinute3;
        (store as any).unitSecond3 = _origUnitSecond3;
    });

    it('gibt Stunden-Unit zurück für ≥3600 Sekunden', () => {
        expect(getTimeUnit(3600)).to.equal(' std');
    });

    it('gibt Stunden-Unit zurück für mehr als 3600 Sekunden', () => {
        expect(getTimeUnit(7200)).to.equal(' std');
    });

    it('gibt Minuten-Unit zurück für ≥60 Sekunden', () => {
        expect(getTimeUnit(60)).to.equal(' min');
    });

    it('gibt Minuten-Unit zurück für genau 3599 Sekunden', () => {
        expect(getTimeUnit(3599)).to.equal(' min');
    });

    it('gibt Sekunden-Unit zurück für <60 Sekunden', () => {
        expect(getTimeUnit(59)).to.equal(' s');
    });

    it('gibt Sekunden-Unit zurück für 0 Sekunden', () => {
        expect(getTimeUnit(0)).to.equal(' s');
    });
});
