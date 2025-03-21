import { useStore } from '../store/store';
import { filterInfo } from './filter-info';
import { errorLogging } from './logging';

export const decomposeInputValue = (
    voiceString: string,
): {
    name: string;
    timerSec: number;
    deleteVal: number;
    inputString: string;
} => {
    const store = useStore();
    const _this = store._this;

    try {
        let inputDecomposed = voiceString.split(',');
        inputDecomposed = inputDecomposed[0].split(' ');

        const { timerString, name, deleteVal, inputString } = filterInfo(inputDecomposed);

        return { name, timerSec: eval(timerString), deleteVal, inputString };
    } catch (e: any) {
        errorLogging({
            text: 'Error in decomposeInputValue: ',
            error: e,
            _this,
            value: `Input: ${voiceString} `,
        });
        return { name: '', timerSec: 0, deleteVal: 0, inputString: '' };
    }
};
