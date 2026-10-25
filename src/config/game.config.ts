import type { GridPosition } from "../data/Grid";
import type { GridStyle } from "../models/GridRenderer";

export const rows = 20;
export const cols = 40;

const cellSize = 30;
export const width = cellSize * cols;
export const height = cellSize * rows;

export const gridStyle: GridStyle = {
  borderColor: "black",
  borderWidth: 1,
  cellSize,
};

export const difficulty = {
  easy: 5,
  medium: 10,
  hard: 15
};

export const snakeHeadStartPosition: GridPosition = {
  row: 3,
  col: 3
};
