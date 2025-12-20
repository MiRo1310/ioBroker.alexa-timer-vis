import type { TimerObject } from '@/types/types';
import TimerCount from '@/app/timerCount';

export const obj: TimerObject = {
    count: TimerCount, // Anzahl aktiver Timer

    intervalTime: 1000,

    status: {
        timer1: false,
        timer2: false,
        timer3: false,
        timer4: false,
    },

    timers: {},
    interval: { timer1: null },
};
