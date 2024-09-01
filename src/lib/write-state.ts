import { Timer, TimerSelector, timerObject } from "./timer-data";
import { firstLetterToUpperCase } from "./global";
import { resetValues } from "./reset";
import { useStore } from "../store/store";

export function writeState(unload: boolean): void {
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
			if (unload) {
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
			_this.setStateChanged(element + ".string", timer.string_Timer, true);
			_this.setStateChanged(element + ".string_2", timer.string_2_Timer, true);
			_this.setStateChanged(element + ".TimeStart", timer.start_Time, true);
			_this.setStateChanged(element + ".TimeEnd", timer.end_Time, true);
			_this.setStateChanged(element + ".InputDeviceName", timer.inputDevice, true);
			_this.setStateChanged(element + ".lengthTimer", timer.lengthTimer, true);
			_this.setStateChanged(element + ".percent2", timer.percent2, true);
			_this.setStateChanged(element + ".percent", timer.percent, true);
			_this.setStateChanged(element + ".name", getTimerName(timer), true);
			_this.setStateChanged("all_Timer.alive", alive, true);
		}
	} catch (e: any) {
		_this.log.error("Error in writeState: " + JSON.stringify(e));
		_this.log.error(e.stack);
	}
}

function getTimerName(timer: Timer): string {
	if (timer.nameFromAlexa) {
		return firstLetterToUpperCase(timer.nameFromAlexa + " Timer");
	}

	if (timer.name && timer.name !== "Timer") {
		return firstLetterToUpperCase(timer.name) + " Timer";
	}

	return "Timer";
}
