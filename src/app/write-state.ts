import { timerObject } from '@/config/timer-data';
import { useStore } from '@/store/store';
import { resetValues } from '@/app/reset';
import { errorLogger } from '@/lib/logging';

export async function writeState({ reset }: { reset: boolean }): Promise<void> {
    const store = useStore();
    const _this = store._this;
    const timers = timerObject.timerActive.timer;
    try {
        for (const timerIndex in timers) {
            const timer = timerObject.timer[timerIndex];

            if (!timer) {
                return;
            }
            if (reset) {
                await resetValues(timer);
            }

            _this.setStateChanged(`${timerIndex}.alive`, timers[timerIndex], true);
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
            _this.setStateChanged(`${timerIndex}.hour`, hours, true);
            _this.setStateChanged(`${timerIndex}.minute`, minutes, true);
            _this.setStateChanged(`${timerIndex}.second`, seconds, true);
            _this.setStateChanged(`${timerIndex}.string`, stringTimer1, true);
            _this.setStateChanged(`${timerIndex}.string_2`, stringTimer2, true);
            _this.setStateChanged(`${timerIndex}.TimeStart`, startTimeString, true);
            _this.setStateChanged(`${timerIndex}.TimeEnd`, endTimeString, true);
            _this.setStateChanged(`${timerIndex}.InputDeviceName`, inputDevice, true);
            _this.setStateChanged(`${timerIndex}.lengthTimer`, lengthTimer, true);
            _this.setStateChanged(`${timerIndex}.percent2`, percent2, true);
            _this.setStateChanged(`${timerIndex}.percent`, percent, true);
            _this.setStateChanged(`${timerIndex}.name`, timer.outPutTimerName(), true);
            _this.setStateChanged(`${timerIndex}.json`, timer.getDataAsJson(), true);
            _this.setStateChanged('all_Timer.alive', !reset, true);
        }
    } catch (e: any) {
        errorLogger('Error in writeState', e, _this);
    }
}
