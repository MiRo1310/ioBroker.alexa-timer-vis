// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			alexa: string;
			intervall1: number;
			intervall2: number;
			unitHour1: string;
			unitHour2: string;
			unitHour3: string;
			unitMinute1: string;
			unitMinute2: string;
			unitMinute3: string;
			unitSecond1: string;
			unitSecond2: string;
			unitSecond3: string;
			valHourForZero: string;
			valMinuteForZero: string;
			valSecondForZero: string;
			entprellZeit: number;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
