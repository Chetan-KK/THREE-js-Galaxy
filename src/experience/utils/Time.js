import EventEmitter from "events";

export default class Time extends EventEmitter {
    constructor () {
        super();

        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        window.requestAnimationFrame(() => {
            this.update();
        });
    }
    update() {

        const currentTime = Date.now();
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.emit('update');

        window.requestAnimationFrame(() => {
            this.update();
        });
    }
}