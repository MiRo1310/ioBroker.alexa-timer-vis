import store from '@/store/store';
import { timerParseTimeInput } from '@/app/timer-parse-time-input';
import { errorLogger } from '@/lib/logging';

export const decomposeInputValue = (
    voiceString: string,
): {
    name: string;
    timerSec: number;
    deleteVal: number;
} => {
    try {
        let inputDecomposed = voiceString.split(',');
        inputDecomposed = inputDecomposed[0].split(' ');

        const { stringToEvaluate, name, deleteVal } = timerParseTimeInput(inputDecomposed);
        return { name, timerSec: eval(stringToEvaluate), deleteVal };
    } catch (e: any) {
        store.adapter.log.error(`Trying to evaluate a string that doesn't contain a valid string: ${voiceString}`);
        errorLogger('Error in decomposeInputValue: ', e);
        return { name: '', timerSec: 0, deleteVal: 0 };
    }
};
