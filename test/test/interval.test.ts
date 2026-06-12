import { expect } from 'chai';
import sinon from 'sinon';
import store from '@/app/store';
import { obj } from '@/config/timer-data';
import { Timer } from '@/app/timer';
import { interval } from '@/app/interval';

describe('interval', () => {
    let fakeAdapter: any;
    let timer: Timer;
    let savedTimers: any;
    let savedStatus: any;
    let savedInterval: any;

    beforeEach(() => {
        fakeAdapter = {
            setInterval: sinon.stub().returns(77),
            clearInterval: sinon.stub(),
            log: { debug: sinon.stub(), warn: sinon.stub(), error: sinon.stub(), info: sinon.stub() },
        };
        (store as any).adapter = fakeAdapter;
        (store as any).localeActiveTimerList = {};
        timer = new Timer({ store });
        savedTimers = { ...obj.timers };
        savedStatus = { ...obj.status };
        savedInterval = { ...obj.interval };
        obj.interval.timerI = null;
        obj.status.timerI = true;
    });

    afterEach(() => {
        obj.timers = savedTimers;
        obj.status = savedStatus;
        obj.interval = savedInterval;
        (store as any).adapter = {};
        (store as any).localeActiveTimerList = {};
        sinon.restore();
    });

    it('gibt früh zurück wenn timerIndex null/leer ist', () => {
        (timer as any).timerIndex = null;
        interval(timer, 1000, false);
        expect(fakeAdapter.setInterval.called).to.be.false;
    });

    it('gibt früh zurück wenn Timer bereits im Intervall läuft', () => {
        (timer as any).timerIndex = 'timerI';
        obj.interval.timerI = 123 as unknown as ioBroker.Interval;
        interval(timer, 1000, false);
        expect(fakeAdapter.setInterval.called).to.be.false;
    });

    it('startet das Intervall wenn Timer aktiv ist', () => {
        (timer as any).timerIndex = 'timerI';
        (timer as any).endTime = Date.now() + 120_000;
        (timer as any).calculatedSeconds = 120;
        interval(timer, 1000, false);
        expect(fakeAdapter.setInterval.calledOnce).to.be.true;
        expect(obj.interval.timerI).to.equal(77);
    });

    it('Intervall-Callback: wechselt zu singleInstance wenn timeLeftSec <= 60', async () => {
        (timer as any).timerIndex = 'timerI';
        (timer as any).endTime = Date.now() + 30_000; // 30s left → timeLeftSec ≤ 60
        (timer as any).calculatedSeconds = 120;
        let capturedCb: any;
        fakeAdapter.setInterval = sinon.stub().callsFake((cb: any) => {
            if (!capturedCb) {
                capturedCb = cb;
            }
            return 77;
        });
        interval(timer, 1000, false);
        expect(capturedCb).to.not.be.undefined;
        if (capturedCb) {
            await capturedCb();
        }
        expect(fakeAdapter.clearInterval.called).to.be.true;
        // recursive call should have started a new interval
        expect(fakeAdapter.setInterval.callCount).to.be.greaterThan(1);
    });

    it('Intervall-Callback: stoppt Timer wenn timeLeftSec <= 0', async () => {
        (timer as any).timerIndex = 'timerI';
        (timer as any).endTime = Date.now() - 10_000; // already past
        (timer as any).calculatedSeconds = 60;
        let capturedCb: any;
        fakeAdapter.setInterval = sinon.stub().callsFake((cb: any) => {
            capturedCb = cb;
            return 77;
        });
        interval(timer, 1000, true); // singleInstance=true → skip first branch
        expect(capturedCb).to.not.be.undefined;
        if (capturedCb) {
            await capturedCb();
        }
        expect(fakeAdapter.log.debug.called).to.be.true;
        expect(timer.isActive).to.be.false;
    });
});
