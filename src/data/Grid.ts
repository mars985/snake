export interface GridOptions {
    rows: number;
    cols: number;
}

export class Grid {
    private buffer;
    public readonly rows;
    public readonly cols;

    constructor(options: GridOptions) {
        this.rows = options.rows;
        this.cols = options.cols;
        this.buffer = new Uint8Array(this.rows * this.cols);
    }

    private getIndex(position: GridPosition): number {
        return position.row * this.cols + position.col;
    }
    
    private isValid(position: GridPosition): boolean {
        return (position.row >= 0 && position.row < this.rows && position.col >= 0 && position.col < this.cols);
    }

    getCell(position: GridPosition): number {
        if(!this.isValid(position))
            return -1;

        const index = this.getIndex(position);
        return this.buffer[index];
    }

    setCell(position: GridPosition, val: number): void {
        if(!this.isValid(position))
            return;
        
        const index = this.getIndex(position);
        this.buffer[index] = val;
    }
};

export interface GridPosition {
    row: number;
    col: number;
};