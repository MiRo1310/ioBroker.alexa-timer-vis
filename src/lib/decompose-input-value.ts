import { useStore } from "../store/store";
import { filterInfo } from "./filter-info";
export const decomposeInputValue = async (
	voiceString: string,
): Promise<{ name: string; timerSec: number; deleteVal: number; inputString: string }> => {
	const store = useStore();
	const _this = store._this;

	try {
		let inputDecomposed = voiceString.split(",");
		inputDecomposed = inputDecomposed[0].split(" ");

		const { timerString, name, deleteVal, inputString } = await filterInfo(inputDecomposed);

		return { name, timerSec: eval(timerString), deleteVal, inputString };
	} catch (e: any) {
		_this.log.error("Error: " + JSON.stringify(e));
		return { name: "", timerSec: 0, deleteVal: 0, inputString: "" };
	}
};
