import type { GridPosition } from "../data/Grid";
import { Queue } from "../data/Queue";

export interface SnakeOptions {
    snakeHead: GridPosition;
    snakeLength?: number;
    snakeDirection?: Direction;
}

export const Directions = {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
    stopped: -1
} as const;

export type Direction = typeof Directions[keyof typeof Directions];

export class Snake {
    private length: number;
    private head: GridPosition;
    private direction: Direction;
    private queue: Queue<GridPosition>;
    private diff = [-1, 0, 1, 0, -1];

    constructor(options: SnakeOptions) {
        this.length = options.snakeLength ?? 1;
        this.length = this.length > 0 ? this.length : 1;
        this.head = options.snakeHead;
        this.direction = options.snakeDirection ?? -1;
        this.queue = new Queue(this.head);
    }

    /*
        0
      3   1
        2

    -1 -> stopped
    0 -> up -> -1,0
    1 -> right -> 0,1
    2 -> down -> 1,0
    3 -> left -> 0,-1
    */

    setDirection(dir: Direction): boolean {
        // stop snake
        if (dir === Directions.stopped) {
            this.direction = dir;
            return true;
        }

        // if snake not stopped
        if (this.direction !== Directions.stopped) {
            const opposite = (this.direction + 2) % 4;
            if (dir === opposite)
                return false;
        }

        this.direction = dir;
        return true;
    }

    getHead(): GridPosition {
        return this.head;
    }

    getLength(): number {
        return this.length;
    }

    grow(amount: number): void {
        this.length += amount;
    }

    getNextHead(): GridPosition {
        if (this.direction === Directions.stopped)
            return this.head;
        return {
            row: this.head.row + this.diff[this.direction],
            col: this.head.col + this.diff[this.direction + 1]
        };
    }

    moveForward(): MoveResult {
        const res: MoveResult = {
            head: this.head,
            tail: null
        };

        if (this.direction === Directions.stopped)
            return res;

        const newHead: GridPosition = this.getNextHead();
        res.head = newHead;
        this.head = newHead;

        this.queue.push(newHead);

        if (this.queue.size > this.length) {
            res.tail = this.queue.pop()!;
        }

        return res;
    }
}

export interface MoveResult {
    head: GridPosition;
    tail: GridPosition | null;
};