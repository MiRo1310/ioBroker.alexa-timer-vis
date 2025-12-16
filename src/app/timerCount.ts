class TimerCount {
    private count = 0;

    public increment(): void {
        this.count++;
    }

    public getCount(): number {
        return this.count;
    }
    public decrement(): void {
        if (this.count > 0) {
            this.count--;
        }
    }
}

export default new TimerCount();
