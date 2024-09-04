import { useStore } from "../store/store";
import { TimerCondition, timerObject } from "./timer-data";

export const getToDo = (value: string): void => {
	const store = useStore();

	const valueArray = value.split(" ");
	const arraysTodo = timerObject.timerActive.condition;
	let foundValue: keyof TimerCondition | null = null;
	let abortLoop = false;

	for (const string in arraysTodo) {
		if (abortLoop) break;

		for (const element of valueArray) {
			if (timerObject.timerActive.data.notNoted.includes(element)) {
				continue;
			} else if (arraysTodo[string as keyof typeof arraysTodo].includes(element)) {
				foundValue = string as keyof TimerCondition;
				abortLoop = true;
				break;
			}
		}
	}

	store.timerAction = foundValue;
};
