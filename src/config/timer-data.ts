import type { TimerObject } from '@/types/types';
import TimerCount from '@/app/timerCount';

export const timers: TimerObject = {
    count: TimerCount, // Anzahl aktiver Timer

    intervalTime: 1000,

    status: {
        timer1: false,
        timer2: false,
        timer3: false,
        timer4: false,
    },

    timerList: {},
    interval: { timer1: null },
};
