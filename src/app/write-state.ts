import { obj } from '@/config/timer-data';
import { errorLogger } from '@/lib/logging';
import store from '@/app/store';
import { getTimerByIndex } from '@/app/timer';

interface ICheckObject {
    init: boolean;
    exist: boolean;
}

const timerObjectStatus: Record<string, ICheckObject> = {};
export const writeStatesByTimerIndex = async (timerIndex: string, reset: boolean): Promise<void> => {
    const adapter = store.adapter;
    if (!adapter) {
        return;
    }

    const timer = getTimerByIndex(timerIndex);

    if (!timer) {
        adapter.log.debug(`No timer for ${timerIndex}`);
        return;
    }

    if (reset) {
        await timer?.reset();
    }

    if (!timerObjectStatus[timerIndex]?.init || reset) {
        const objectExists = await adapter.getObjectAsync(`${timerIndex}.alive`);
        timerObjectStatus[timerIndex] = { init: true, exist: !!objectExists };

        if (!objectExists) {
            adapter.log.debug(`Object for ${timerIndex} does not exist, no reset statements will be written`);
            return;
        }
    }

    if (!timerObjectStatus[timerIndex].exist) {
        return;
    }

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
    adapter.setStateChanged(`${timerIndex}.alive`, timer.isActive, true);
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

export async function writeStates({ reset }: { reset: boolean }): Promise<void> {
    try {
        for (const timerIndex in obj.status) {
            await writeStatesByTimerIndex(timerIndex, reset);
        }
    } catch (e: any) {
        errorLogger.send({
            title: 'Error in writeState',
            e,
        });
    }
}
