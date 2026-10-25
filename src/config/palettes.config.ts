import type { BoardStateName } from "../models/Board";

export type Palette = Record<BoardStateName, string>;

export const palettes = {
  emerald: {
    empty: "#0f172a",
    snakeBody: "#22c55e",
    snakeHead: "#15803d",
    fruit: "#ef4444",
    wall: "#334155",
  },
  cyberpunk: {
    empty: "#0a051b",
    snakeBody: "#06b6d4",
    snakeHead: "#a855f7",
    fruit: "#f43f5e",
    wall: "#3b0764",
  },
  sunset: {
    empty: "#1c102b",
    snakeBody: "#fb923c",
    snakeHead: "#e11d48",
    fruit: "#facc15",
    wall: "#4c1d95",
  },
  ocean: {
    empty: "#041624",
    snakeBody: "#38bdf8",
    snakeHead: "#0284c7",
    fruit: "#fb7185",
    wall: "#0f324d",
  },
  forest: {
    empty: "#102016",
    snakeBody: "#a7c957",
    snakeHead: "#6a994e",
    fruit: "#bc4749",
    wall: "#2d5a37",
  },
  dracula: {
    empty: "#282a36",
    snakeBody: "#50fa7b",
    snakeHead: "#8be9fd",
    fruit: "#ff5555",
    wall: "#6272a4",
  },
  gameboy: {
    empty: "#8b956d",
    snakeBody: "#4b5320",
    snakeHead: "#283015",
    fruit: "#121707",
    wall: "#606b47",
  },
  monochrome: {
    empty: "#18181b",
    snakeBody: "#71717a",
    snakeHead: "#e4e4e7",
    fruit: "#f59e0b",
    wall: "#3f3f46",
  },
  candy: {
    empty: "#26253a",
    snakeBody: "#f4a261",
    snakeHead: "#e76f51",
    fruit: "#2a9d8f",
    wall: "#47436b",
  },
  worm: {
    empty: "blue",
    snakeBody: "#e2b8b4",
    snakeHead: "#dc7f8e",
    fruit: "white",
    wall: "purple",
  },
} satisfies Record<string, Palette>;

export type PaletteName = keyof typeof palettes;
