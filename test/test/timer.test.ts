import { expect } from 'chai';
import { filterInfo } from '@/lib/filter-info';
import * as storeModule from '@/store/store';
import sinon from 'sinon';
import type { Store } from '@/types/types';

describe('Timer', () => {
    it('should correct simple timer', () => {
        const input = ['timer', '5', 'minuten'];
        const { name, timerString, deleteVal } = filterInfo(input);
        expect(name).to.equal('');
        expect(timerString).to.equal('(5)*60');
        expect(deleteVal).to.equal(0);
    });

    it('should Name and timer values ', () => {
        const input = ['brot', 'timer', 'eine', 'stunde', 'zehn', 'minuten', 'fünf', 'und', 'dreißig', 'sekunden'];
        const { name, timerString, deleteVal } = filterInfo(input);
        expect(name).to.equal('brot');
        expect(timerString).to.equal('(1)*3600+(10)*60+(5+30)');
        expect(deleteVal).to.equal(0);
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
        const { name, timerString, deleteVal } = filterInfo(input);
        expect(name).to.equal('fleisch');
        expect(timerString).to.equal('(3)*3600+(3+30)*60+(7+40)');
        expect(deleteVal).to.equal(0);
    });
    it('should Name another timer with name and values', () => {
        const input = ['timer', 'fünf', 'stunden', 'neun', 'und', 'fünfzig', 'minuten', 'dreizehn', 'sekunden'];
        const { name, timerString, deleteVal } = filterInfo(input);
        expect(name).to.equal('');
        expect(timerString).to.equal('(5)*3600+(9+50)*60+(13)');
        expect(deleteVal).to.equal(0);
    });
    it('should Name another timer with name and values', () => {
        const input = ['timer', 'hundert', 'zwanzig', 'minuten', 'zwölf', 'sekunden'];
        const { name, timerString, deleteVal } = filterInfo(input);
        expect(name).to.equal('');
        expect(timerString).to.equal('(100+20)*60+(12)');
        expect(deleteVal).to.equal(0);
    });

    it('remove one timer', () => {
        sinon.stub(storeModule, 'useStore').returns({
            isDeleteTimer: () => true,
        } as Store);

        const input = ['stop', 'pommes', 'timer'];
        const { name, timerString } = filterInfo(input);
        expect(name).to.equal('');
        expect(timerString).to.equal('');
        // expect(deleteVal).to.equal(0);

        sinon.restore();
    });
});
