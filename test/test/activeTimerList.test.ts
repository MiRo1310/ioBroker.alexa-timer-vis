// typescript
import { expect } from 'chai';
import store from '@/store/store';
import type { LocalAlexaActiveTimerList } from '@/types/types';

describe('Store.getRemovedTimerId', () => {
    const serial = 'serial123';
    const defaultValues = { deviceSerialNumber: '', triggerTime: 0, durationMillis: 0, label: '' };
    const localActiveTimerList: LocalAlexaActiveTimerList = {
        [serial]: [
            { id: 't1', ...defaultValues },
            { id: 't2', ...defaultValues },
            { id: 't3', ...defaultValues },
        ],
    };
    beforeEach(() => {
        (store as any).localeActiveTimerList = localActiveTimerList;
    });

    afterEach(() => {
        (store as any).localeActiveTimerList = [];
    });

    it('entfernt ein fehlendes Timer-ID und gibt diese zurück', () => {
        const activeTimerLists = [{ id: 't2' }]; // t1 und t3 fehlt -> sollte entfernt werden
        const removed = (store as any).getRemovedTimerId(activeTimerLists, serial);
        expect(removed).to.equal('t1');
        (store as any).localeActiveTimerList = {
            [serial]: [
                { id: 't2', ...defaultValues },
                { id: 't3', ...defaultValues },
            ],
        };
        const removed2 = (store as any).getRemovedTimerId(activeTimerLists, serial);
        expect(removed2).to.equal('t3');
    });

    it('gibt undefined zurück, wenn keine ID fehlt', () => {
        const activeTimerLists = [{ id: 't1' }, { id: 't2' }, { id: 't3' }];
        const removed = (store as any).getRemovedTimerId(activeTimerLists, serial);
        expect(removed).to.be.undefined;
    });

    it('gibt undefined zurück , wenn keine ID fehlt bzw eine mehr da ist', () => {
        const activeTimerLists = [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }];
        const removed = (store as any).getRemovedTimerId(activeTimerLists, serial);
        expect(removed).to.be.undefined;
    });
});
