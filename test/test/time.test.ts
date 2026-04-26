import { expect } from 'chai';
import { getTimerStringUnitBasedOnTime, millisecondsToString } from '@/lib/time';
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
