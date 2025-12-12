import store from '@/store/store';
import { timerParseTimeInput } from '@/app/timer-parse-time-input';
import errorLogger from '@/lib/logging';
import type { VoiceInput } from '@/app/voiceInput';

export const decomposeInputValue = (
    voiceInputClass: VoiceInput,
): {
    name: string;
    timerSec: number;
    deleteVal: number;
} => {
    const voiceInput = voiceInputClass.get();
    try {
        let inputDecomposed = voiceInput.split(',');
        inputDecomposed = inputDecomposed[0].split(' ');

        const { stringToEvaluate, name, deleteVal } = timerParseTimeInput(inputDecomposed);
        return { name, timerSec: eval(stringToEvaluate), deleteVal };
    } catch (e: any) {
        store.adapter.log.error(`Trying to evaluate a string that doesn't contain a valid string: ${voiceInput}`);
        errorLogger.send({
            title: 'Error in decomposeInputValue',
            e,
            additionalInfos: [['VoiceInput', voiceInputClass.get()]],
        });

        return { name: '', timerSec: 0, deleteVal: 0 };
    }
};
