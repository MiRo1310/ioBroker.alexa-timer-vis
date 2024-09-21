import { timerObject } from "./timer-data";
import { writeState } from "./write-state";
import { useStore } from "../store/store";
import { errorLogging } from "./logging";

let writeStateActive = false;
export const writeStateIntervall = (): void => {
	const store = useStore();
	const _this = store._this;
	try {
		if (!writeStateActive) {
			writeStateActive = true;

			store.interval = _this.setInterval(() => {
				writeState(false);

				if (timerObject.timerActive.timerCount == 0) {
					writeStateActive = false;

					_this.setState("all_Timer.alive", false, true);
					_this.log.debug("Intervall stopped!");
					_this.clearInterval(store.interval);
				}
			}, timerObject.timerActive.data.interval);
		}
	} catch (e: any) {
		errorLogging("Error in writeStateIntervall", e, _this);
		_this.clearInterval(store.interval);
	}
};
