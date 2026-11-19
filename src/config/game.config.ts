import type { GridPosition } from "../data/Grid";
import type { GridStyle } from "../game/GridRenderer";

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
  hard: 15,
};

export type DifficultyName = keyof typeof difficulty;

export const difficultyColors: Record<DifficultyName, string> = {
  easy: "text-green-400",
  medium: "text-red-400",
  hard: "text-purple-400",
};

export const difficultyNames = Object.keys(difficulty) as DifficultyName[];
export const difficultyLevels = Object.values(difficulty);

export const snakeHeadStartPosition: GridPosition = {
  row: 3,
  col: 3,
};

export const snakeStartLength = 1;

export const snakeGrowIncrement = 5;
