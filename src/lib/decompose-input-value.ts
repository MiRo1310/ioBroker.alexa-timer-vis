import { useStore } from '@/store/store';
import { filterInfo } from '@/lib/filter-info';
import { errorLogger } from '@/lib/logging';

export const decomposeInputValue = (
    voiceString: string,
): {
    name: string;
    timerSec: number;
    deleteVal: number;
} => {
    const store = useStore();
    const _this = store._this;

    try {
        let inputDecomposed = voiceString.split(',');
        inputDecomposed = inputDecomposed[0].split(' ');

        const { timerString, name, deleteVal } = filterInfo(inputDecomposed);
        return { name, timerSec: eval(timerString), deleteVal };
    } catch (e: any) {
        _this.log.error(`Trying to evaluate a string that doesn't contain a valid string: ${voiceString}`);
        errorLogger('Error in decomposeInputValue: ', e, _this);
        return { name: '', timerSec: 0, deleteVal: 0 };
    }
};
