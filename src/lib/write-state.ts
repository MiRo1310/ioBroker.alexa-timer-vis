import { timerObject } from '../config/timer-data';
import { resetValues } from './reset';
import { useStore } from '../store/store';
import { errorLogger } from './logging';

export async function writeState({ reset }: { reset: boolean }): Promise<void> {
    const store = useStore();
    const _this = store._this;
    const timers = timerObject.timerActive.timer;
    try {
        for (const timerName in timers) {
            const timer = timerObject.timer[timerName];

            if (!timer) {
                return;
            }

            let alive = true;
            if (reset) {
                await resetValues(timer, timerName);
                alive = false;
            }

            _this.setStateChanged(`${timerName}.alive`, timerObject.timerActive.timer[timerName], true);
            const {
                hours,
                minutes,
                seconds,
                stringTimer1,
                stringTimer2,
                startTimeString,
                endTimeString,
                inputDevice,
                lengthTimer,
                percent,
                percent2,
            } = timer.getOutputProperties();
            _this.setStateChanged(`${timerName}.hour`, hours, true);
            _this.setStateChanged(`${timerName}.minute`, minutes, true);
            _this.setStateChanged(`${timerName}.second`, seconds, true);
            _this.setStateChanged(`${timerName}.string`, stringTimer1, true);
            _this.setStateChanged(`${timerName}.string_2`, stringTimer2, true);
            _this.setStateChanged(`${timerName}.TimeStart`, startTimeString, true);
            _this.setStateChanged(`${timerName}.TimeEnd`, endTimeString, true);
            _this.setStateChanged(`${timerName}.InputDeviceName`, inputDevice, true);
            _this.setStateChanged(`${timerName}.lengthTimer`, lengthTimer, true);
            _this.setStateChanged(`${timerName}.percent2`, percent2, true);
            _this.setStateChanged(`${timerName}.percent`, percent, true);
            _this.setStateChanged(`${timerName}.name`, timer.outPutTimerName(), true);
            _this.setStateChanged(`${timerName}.json`, timer.getDataAsJson(), true);
            _this.setStateChanged('all_Timer.alive', alive, true);
        }
    } catch (e: any) {
        errorLogger('Error in writeState', e, _this);
    }
}
