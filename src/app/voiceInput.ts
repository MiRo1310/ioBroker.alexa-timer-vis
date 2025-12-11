import store from '@/store/store';
import { timerObject } from '@/config/timer-data';

export class VoiceInput {
    private readonly voiceInput: string;

    constructor(voiceInput: ioBroker.StateValue) {
        this.voiceInput = String(voiceInput);
    }
    get(): string {
        return this.voiceInput;
    }
    doesAlexaSendAQuestion(): boolean {
        const question = this.voiceInput.indexOf(',') != -1;
        store.questionAlexa = question;
        return question;
    }
    getAbortWord(): string | undefined {
        return timerObject.timerActive.data.abortWords.find(word =>
            this.voiceInput.toLocaleLowerCase().includes(word.toLocaleLowerCase()),
        );
    }
    isAbortSentence(): boolean {
        return timerObject.timerActive.data.notNotedSentence.some(sentence => sentence === this.voiceInput);
    }
    isExtendOrShortenSentence(): boolean {
        return this.voiceInput.includes('um');
    }
    getIndexOfExtendWordTo(): number {
        return this.voiceInput.indexOf('um');
    }
    getIndexOf(str: string): number {
        return this.voiceInput.indexOf(str);
    }
    getValueExtendBefore(): string[] {
        return this.voiceInput.slice(0, this.getIndexOfExtendWordTo()).split(' ');
    }
    getValueExtend(): string[] {
        return this.voiceInput.slice(this.getIndexOfExtendWordTo() + 2).split(' ');
    }
}
