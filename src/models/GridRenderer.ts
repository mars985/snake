import type { Grid } from "./Grid";
import type { Palette } from "./palettes";

export interface GridRendererOptions {
  ctx: CanvasRenderingContext2D;
  gridStyle: GridStyle;
  palette: Palette;
}

export class GridRenderer {
  private ctx;
  private palette;
  private gridStyle;

  constructor(options: GridRendererOptions) {
    this.ctx = options.ctx;
    this.palette = options.palette;
    this.gridStyle = options.gridStyle;
  }

  drawCell(x: number, y: number, val: number): void {
    const ctx = this.ctx;
    const { cellSize, borderColor, borderWidth } = this.gridStyle;

    ctx.fillStyle = borderColor;
    ctx.fillRect(x, y, cellSize, cellSize);

    ctx.fillStyle = this.getColor(val);

    ctx.fillRect(
      x + borderWidth,
      y + borderWidth,
      cellSize - 2 * borderWidth,
      cellSize - 2 * borderWidth,
    );
  }

  private getColor(val: number): string {
    switch (val) {
      case 0:
        return this.palette.empty;
      case 1:
        return this.palette.snakeBody;
      case 2:
        return this.palette.snakeHead;
      case 3:
        return this.palette.fruit;
      case 4:
        return this.palette.wall;
      default:
        return "white";
    }
  }

  drawGrid(grid: Grid): void {
    const { cellSize } = this.gridStyle;

    for (let i = 0; i < grid.rows; i++) {
      for (let j = 0; j < grid.cols; j++) {
        const x = j * cellSize;
        const y = i * cellSize;

        const val = grid.getCell({ row: i, col: j });

        this.drawCell(x, y, val);
      }
    }
  }

  setStyle(style: GridStyle): void {
    this.gridStyle = style;
  }

  setPalette(palette: Palette): void {
    this.palette = palette;
  }
}

export type GridStyle = {
  cellSize: number;
  borderColor: string;
  borderWidth: number;
};
