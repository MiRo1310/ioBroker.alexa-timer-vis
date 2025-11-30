import { expect } from 'chai';
import { filterInfo } from '@/lib/filter-info';
import * as storeModule from '@/store/store';
import sinon from 'sinon';
import type { Store } from '@/types/types';

describe('Timer', () => {
    it('should correct simple timer', () => {
        const input = ['timer', '5', 'minuten'];
        const { name, inputString, timerString, deleteVal } = filterInfo(input);
        expect(name).to.equal('');
        expect(inputString).to.equal('5 Minuten');
        expect(timerString).to.equal('(5)*60');
        expect(deleteVal).to.equal(0);
    });

    it('should Name and timer values ', () => {
        const input = ['brot', 'timer', 'eine', 'stunde', 'zehn', 'minuten', 'fünf', 'und', 'dreißig', 'sekunden'];
        const { name, inputString, timerString, deleteVal } = filterInfo(input);
        expect(name).to.equal('brot');
        expect(inputString).to.equal('1 Stunde 10 Minuten 5 und 30 Sekunden');
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
        const { name, inputString, timerString, deleteVal } = filterInfo(input);
        expect(name).to.equal('fleisch');
        expect(inputString).to.equal('3 Stunden 3 und 30 Minuten 7 und 40 Sekunden');
        expect(timerString).to.equal('(3)*3600+(3+30)*60+(7+40)');
        expect(deleteVal).to.equal(0);
    });

    // it.only('remove one timer', () => {
    //     sinon.stub(storeModule, 'useStore').returns({
    //         isDeleteTimer: () => true,
    //     } as Store);
    //
    //     const input = ['stop', 'pommes', 'timer'];
    //     const { name, inputString, timerString, deleteVal } = filterInfo(input);
    //     // expect(name).to.equal('pommes');
    //     expect(inputString).to.equal('');
    //     expect(timerString).to.equal('');
    //     expect(deleteVal).to.equal(0);
    //
    //     sinon.restore();
    // });
});
