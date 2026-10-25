import { Grid, type GridOptions, type GridPosition } from "../data/Grid";
import { RandomizedSet } from "../data/RandomizedSet";
import { Snake, type SnakeOptions } from "./Snake";

export interface BoardOptions extends GridOptions, SnakeOptions {
    growIncrement?: number;
};

export const BoardStates = {
    empty: 0,
    snakeBody: 1,
    snakeHead: 2,
    fruit: 3,
    wall: 4,
} as const;

export type BoardStateName = keyof typeof BoardStates;

export type BoardState = typeof BoardStates[keyof typeof BoardStates];

export class Board {
    private rows;
    private cols;
    public readonly grid;

    private snake;
    private growIncrement;
    private canTurn; // once per tick

    private emptyCells: RandomizedSet<GridPosition, string>;

    constructor(options: BoardOptions) {
        this.rows = options.rows;
        this.cols = options.cols;
        this.grid = new Grid(options);

        this.snake = new Snake(options);
        this.growIncrement = options.growIncrement ?? 5;
        this.canTurn = true;
        this.grid.setCell(options.snakeHead, BoardStates.snakeHead);

        this.emptyCells = new RandomizedSet<GridPosition, string>(pos => `${pos.row},${pos.col}`);
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const pos: GridPosition = { row, col };
                if (this.grid.getCell(pos) === BoardStates.empty) {
                    this.emptyCells.insert(pos);
                }
            }
        }
    }

    addFruit(): void;
    addFruit(position: GridPosition): void;

    addFruit(position?: GridPosition): void {
        if (position) {
            if (this.grid.getCell(position) !== 0)
                return;

            this.grid.setCell(position, BoardStates.fruit);
        } else {
            if (this.emptyCells.length === 0)
                return;

            const randomPosition = this.emptyCells.getRandom();
            this.emptyCells.remove(randomPosition);
            this.grid.setCell(randomPosition, BoardStates.fruit);
        }
    }

    setSnakeDirection(dir: number): void {
        if (!this.canTurn)
            return;

        const directionChanged: boolean = this.snake.setDirection(dir);
        if (directionChanged) {
            this.canTurn = false;
        }
    }

    get snakeLength() {
        return this.snake.getLength();
    }

    update(): BoardEvent {
        this.canTurn = true;
        const currHead = this.snake.getHead();
        const nextHead = this.snake.getNextHead();
        const cellValue = this.grid.getCell(nextHead);

        let res: BoardEvent;

        if (!(currHead.row === nextHead.row && currHead.col === nextHead.col)) {
            if (cellValue === BoardStates.snakeBody) {
                res = { type: "collision", with: "self" }
            } else if (cellValue === BoardStates.wall || cellValue === -1) {
                res = { type: "collision", with: "wall" }
            } else if (cellValue === BoardStates.fruit) {
                res = { type: "fruit-eaten" }
                this.snake.grow(this.growIncrement);
            } else {
                res = { type: "snake-moved" };
            }
        } else {
            res = { type: "snake-stopped" };
            return res;
        }

        this.grid.setCell(currHead, BoardStates.snakeBody);
        this.emptyCells.remove(nextHead);

        const { head, tail } = this.snake.moveForward();
        this.grid.setCell(head, BoardStates.snakeHead);

        if (tail) {
            this.grid.setCell(tail, BoardStates.empty);
            this.emptyCells.insert(tail);
        }

        return res;
    }
}

export type BoardEvent =
    | { type: "snake-stopped" }
    | { type: "snake-moved" }
    | { type: "fruit-eaten" }
    | { type: "collision", with: "wall" | "self" };