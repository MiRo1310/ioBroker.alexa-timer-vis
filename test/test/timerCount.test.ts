import { expect } from 'chai';
import { obj } from '@/config/timer-data';

describe('TimerCount.increment / decrement / getCount', () => {
    beforeEach(() => {
        (obj.count as any).count = 0;
    });

    afterEach(() => {
        (obj.count as any).count = 0;
    });

    it('increment erhöht den Zähler um 1', () => {
        obj.count.increment();
        expect(obj.count.getCount()).to.equal(1);
    });

    it('mehrfaches increment summiert sich', () => {
        obj.count.increment();
        obj.count.increment();
        expect(obj.count.getCount()).to.equal(2);
    });

    it('decrement verringert den Zähler um 1', () => {
        obj.count.increment();
        obj.count.decrement();
        expect(obj.count.getCount()).to.equal(0);
    });

    it('decrement bei 0 bleibt bei 0', () => {
        obj.count.decrement();
        expect(obj.count.getCount()).to.equal(0);
    });
});
