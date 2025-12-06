import { timerObject } from '@/config/timer-data';
import { resetTimer } from '@/app/reset';
import { errorLogger } from '@/lib/logging';
import store from '@/store/store';

export const resetStatesByTimerIndex = async (timerIndex: string | null, reset: boolean): Promise<void> => {
    const adapter = store.adapter;
    if (!timerIndex) {
        return;
    }
    const timer = timerObject.timer[timerIndex];
    if (reset) {
        await resetTimer(timer);
    }

    adapter.setStateChanged(`${timerIndex}.alive`, timer.isActive, true);
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
        initialTimer,
    } = timer.getOutputProperties();
    adapter.setStateChanged(`${timerIndex}.hour`, hours, true);
    adapter.setStateChanged(`${timerIndex}.minute`, minutes, true);
    adapter.setStateChanged(`${timerIndex}.second`, seconds, true);
    adapter.setStateChanged(`${timerIndex}.string`, stringTimer1, true);
    adapter.setStateChanged(`${timerIndex}.string_2`, stringTimer2, true);
    adapter.setStateChanged(`${timerIndex}.TimeStart`, startTimeString, true);
    adapter.setStateChanged(`${timerIndex}.TimeEnd`, endTimeString, true);
    adapter.setStateChanged(`${timerIndex}.InputDeviceName`, inputDevice, true);
    adapter.setStateChanged(`${timerIndex}.lengthTimer`, lengthTimer, true);
    adapter.setStateChanged(`${timerIndex}.percent2`, percent2, true);
    adapter.setStateChanged(`${timerIndex}.percent`, percent, true);
    adapter.setStateChanged(`${timerIndex}.initialTimer`, initialTimer, true);
    adapter.setStateChanged(`${timerIndex}.name`, timer.outPutTimerName(), true);
    adapter.setStateChanged(`${timerIndex}.json`, timer.isActive ? timer.getDataAsJson() : '{}', true);
    adapter.setStateChanged('all_Timer.alive', !reset, true);
};

export async function writeState({ reset }: { reset: boolean }): Promise<void> {
    const timers = timerObject.timerActive.timer;
    try {
        for (const timerIndex in timers) {
            await resetStatesByTimerIndex(timerIndex, reset);
        }
    } catch (e: any) {
        errorLogger('Error in writeState', e);
    }
}
