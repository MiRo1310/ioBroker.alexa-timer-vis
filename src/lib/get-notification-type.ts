import { useStore } from "../store/store";
import { isIobrokerValue } from "./global";
import { TimerCondition } from "./timer-data";

export const getNotificationType = async (): Promise<void> => {
	const store = useStore();
	const { _this } = store;

	const link = `alexa2.${store.getAlexaInstanceObject().instance}.history.intent`;
	const result = await _this.getForeignStateAsync(link);
	if (isIobrokerValue(result)) {
		store.timerAction = result.val as TimerCondition;
	}
};
