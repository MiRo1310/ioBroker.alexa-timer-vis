// typescript
import { expect } from 'chai';
import store from '@/store/store';

describe('Store.getRemovedTimerId', () => {
    beforeEach(() => {
        (store as any).localeActiveTimerList = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = [];
    });

    it('entfernt ein fehlendes Timer-ID und gibt diese zurück', () => {
        const activeTimerLists = [{ id: 't2' }]; // t1 und t3 fehlt -> sollte entfernt werden
        const removed = (store as any).getRemovedTimerId(activeTimerLists);
        expect(removed).to.equal('t1');
        (store as any).localeActiveTimerList = [{ id: 't2' }, { id: 't3' }];
        const removed2 = (store as any).getRemovedTimerId(activeTimerLists);
        expect(removed2).to.equal('t3');
    });

    it('gibt undefined zurück, wenn keine ID fehlt', () => {
        const activeTimerLists = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
        const removed = (store as any).getRemovedTimerId(activeTimerLists);
        expect(removed).to.be.undefined;
    });

    it('gibt undefined zurück , wenn keine ID fehlt bzw eine mehr da ist', () => {
        const activeTimerLists = [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }];
        const removed = (store as any).getRemovedTimerId(activeTimerLists);
        expect(removed).to.be.undefined;
    });
});
