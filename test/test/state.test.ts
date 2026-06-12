import { expect } from 'chai';
import { isIobrokerValue } from '@/lib/state';
import { getIndexFromId, isAlexaTimerVisResetButton } from '@/app/ioBrokerStateAndObjects';

describe('isIobrokerValue', () => {
    it('gibt true zurück wenn val eine Zahl ist', () => {
        expect(isIobrokerValue({ val: 42 } as ioBroker.State)).to.be.true;
    });

    it('gibt true zurück wenn val 0 ist', () => {
        expect(isIobrokerValue({ val: 0 } as ioBroker.State)).to.be.true;
    });

    it('gibt true zurück wenn val false ist', () => {
        expect(isIobrokerValue({ val: false } as ioBroker.State)).to.be.true;
    });

    it('gibt true zurück wenn val ein leerer String ist', () => {
        expect(isIobrokerValue({ val: '' } as ioBroker.State)).to.be.true;
    });

    it('gibt false zurück wenn val undefined ist', () => {
        expect(isIobrokerValue({ val: undefined } as any)).to.be.false;
    });

    it('gibt false zurück wenn val null ist', () => {
        expect(isIobrokerValue({ val: null } as any)).to.be.false;
    });

    it('gibt false zurück für null als Argument', () => {
        expect(isIobrokerValue(null)).to.be.false;
    });

    it('gibt false zurück für undefined als Argument', () => {
        expect(isIobrokerValue(undefined)).to.be.false;
    });
});

describe('isAlexaTimerVisResetButton', () => {
    const validState = { val: true } as ioBroker.State;

    it('gibt true zurück wenn State gültig und ID .Reset enthält', () => {
        expect(isAlexaTimerVisResetButton(validState, 'alexa-timer-vis.0.timer1.Reset')).to.be.true;
    });

    it('gibt false zurück wenn State null ist', () => {
        expect(isAlexaTimerVisResetButton(null, 'alexa-timer-vis.0.timer1.Reset')).to.be.false;
    });

    it('gibt false zurück wenn State undefined ist', () => {
        expect(isAlexaTimerVisResetButton(undefined, 'alexa-timer-vis.0.timer1.Reset')).to.be.false;
    });

    it('gibt false zurück wenn ID kein .Reset enthält', () => {
        expect(isAlexaTimerVisResetButton(validState, 'alexa-timer-vis.0.timer1.alive')).to.be.false;
    });

    it('gibt false zurück wenn val null ist (kein gültiger ioBroker-Wert)', () => {
        expect(isAlexaTimerVisResetButton({ val: null } as any, 'alexa-timer-vis.0.timer1.Reset')).to.be.false;
    });
});

describe('getIndexFromId', () => {
    it('extrahiert den Timer-Index an Position [2]', () => {
        expect(getIndexFromId('alexa-timer-vis.0.timer1.Reset')).to.equal('timer1');
    });

    it('gibt leeren String zurück wenn ID zu kurz ist', () => {
        expect(getIndexFromId('alexa-timer-vis.0')).to.equal('');
    });

    it('gibt leeren String zurück für leere ID', () => {
        expect(getIndexFromId('')).to.equal('');
    });

    it('funktioniert für timer2', () => {
        expect(getIndexFromId('alexa-timer-vis.0.timer2.alive')).to.equal('timer2');
    });
});
