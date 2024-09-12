import { Store } from './store/store';

export interface GenerateTimeStringObject { timeString: string, hour: string, minutes: string, seconds: string, store: Store }

export interface AlexaActiveTimerList {
    id: string;
    label: string | null;
    triggerTime: number;
}