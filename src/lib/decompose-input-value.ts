import { useStore } from "../store/store";
import { filterInfo } from "./filter-info";
export const decomposeInputValue = async (
	inputString: string,
): Promise<{ name: string; timerSec: number; deleteVal: number; inputString: string }> => {
	const store = useStore();
	const _this = store._this;

	try {
		let inputDecomposed = inputString.split(",");
		inputDecomposed = inputDecomposed[0].split(" ");

		const returnArray = await filterInfo(inputDecomposed);

		let name = "";
		if (returnArray[1]) {
			name = returnArray[1];
		}

		let timerSec = 0;
		if (returnArray[0]) {
			timerSec = eval(returnArray[0]);
		}

		return { name, timerSec, deleteVal: returnArray[2], inputString: returnArray[3] };
	} catch (e: any) {
		_this.log.error("Error: " + JSON.stringify(e));
		return { name: "", timerSec: 0, deleteVal: 0, inputString: "" };
	}
};
