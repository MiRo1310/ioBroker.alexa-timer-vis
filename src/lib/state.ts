import { isDefined } from '@/lib/object';

export const isIobrokerValue = (obj: ioBroker.State | null | undefined): obj is ioBroker.State => isDefined(obj?.val);
