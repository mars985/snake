export class Queue<T> {
    private elements: T[];
    private offset: number;

    constructor(...elements: T[]) {
        this.elements = elements;
        this.offset = 0;
    }

    get size(): number {
        return this.elements.length - this.offset;
    }

    empty(): boolean {
        return this.size === 0;
    }

    front(): T | null {
        return this.size > 0 ? this.elements[this.offset] : null;
    }

    push(element: T): Queue<T> {
        this.elements.push(element);
        return this;
    }

    pop(): T | null {
        if (this.size === 0) return null;

        const first = this.front();
        this.offset += 1;

        // only remove dequeued elements when reaching half size
        // to decrease latency of shifting elements.
        if (this.offset * 2 >= this.elements.length) {
            this.elements = this.elements.slice(this.offset);
            this.offset = 0;
        }
        return first;
    }
}