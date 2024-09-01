import { useStore } from "../store/store";
import { createState } from "./state";

export const setAdapterStatusAndInitStateCreation = (): void => {
	const store = useStore();
	const _this = store._this;

	_this.getForeignObject(store.pathAlexaSummary, (err, obj) => {
		if (err || obj == null) {
			_this.log.error(`The State ${store.pathAlexaSummary} was not found!`);
		} else {
			_this.log.info("Alexa State was found");
			_this.setState("info.connection", true, true);

			createState(4);
		}
	});
};
