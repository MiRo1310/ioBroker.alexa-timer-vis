import { timerObject } from "./timer-data";

export const shouldDelete = (voiceInput: string): { varInputContainsDelete: boolean } => {
	for (const element of timerObject.timerActive.condition.deleteTimer) {
		if (voiceInput.includes(element)) {
			return { varInputContainsDelete: true };
		}
	}

	return { varInputContainsDelete: false };
};
