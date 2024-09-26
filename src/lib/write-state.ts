import { Timer, TimerSelector, timerObject } from "./timer-data";
import { firstLetterToUpperCase } from "./global";
import { resetValues } from "./reset";
import { useStore } from "../store/store";
import { deepCopy } from "./object";
import { errorLogging } from "./logging";

export function writeState({ reset }: { reset: boolean }): void {
	const store = useStore();
	const _this = store._this;
	const timers = timerObject.timerActive.timer;
	try {
		for (const element in timers) {
			const timer = timerObject.timer[element as keyof typeof timerObject.timer];

			if (!timer) {
				return;
			}

			let alive = true;
			if (reset) {
				resetValues(timer, element as TimerSelector);
				alive = false;
			}

			_this.setStateChanged(
				element + ".alive",
				timerObject.timerActive.timer[element as keyof typeof timerObject.timer],
				true,
			);

			_this.setStateChanged(element + ".hour", timer.hour, true);
			_this.setStateChanged(element + ".minute", timer.minute, true);
			_this.setStateChanged(element + ".second", timer.second, true);
			_this.setStateChanged(element + ".string", timer.stringTimer, true);
			_this.setStateChanged(element + ".string_2", timer.stringTimer2, true);
			_this.setStateChanged(element + ".TimeStart", timer.startTimeString, true);
			_this.setStateChanged(element + ".TimeEnd", timer.endTimeString, true);
			_this.setStateChanged(element + ".InputDeviceName", timer.inputDevice, true);
			_this.setStateChanged(element + ".lengthTimer", timer.lengthTimer, true);
			_this.setStateChanged(element + ".percent2", timer.percent2, true);
			_this.setStateChanged(element + ".percent", timer.percent, true);
			_this.setStateChanged(element + ".name", getTimerName(timer), true);
			_this.setStateChanged(element + ".json", getJson(timer), true);
			_this.setStateChanged("all_Timer.alive", alive, true);
		}
	} catch (e: any) {
		errorLogging("Error in writeState", e, _this);
	}

	function getJson(timer: Timer): ioBroker.State | ioBroker.StateValue | ioBroker.SettableState {
		const copy = deepCopy(timer);
		delete (copy as any).extendOrShortenTimer;
		return JSON.stringify(copy);
	}
}

function getTimerName(timer: Timer): string {
	if (timer.alexaTimerName) {
		return firstLetterToUpperCase(timer.alexaTimerName + " Timer");
	}

	if (timer.name !== "Timer") {
		return firstLetterToUpperCase(timer.name) + " Timer";
	}

	return "Timer";
}
