export interface Palette {
  empty: string;
  snakeBody: string;
  snakeHead: string;
  fruit: string;
  wall: string;
}

function paletteCreator(
  empty: string,
  snakeBody: string,
  snakeHead: string,
  fruit: string,
  wall: string,
): Palette {
  return {
    empty,
    snakeBody,
    snakeHead,
    fruit,
    wall,
  };
}

export const palettes: Record<string, Palette> = {
  emerald: paletteCreator("#0f172a", "#22c55e", "#15803d", "#ef4444", "#334155"),
  cyberpunk: paletteCreator("#0a051b", "#06b6d4", "#a855f7", "#f43f5e", "#3b0764"),
  sunset: paletteCreator("#1c102b", "#fb923c", "#e11d48", "#facc15", "#4c1d95"),
  ocean: paletteCreator("#041624", "#38bdf8", "#0284c7", "#fb7185", "#0f324d"),
  forest: paletteCreator("#102016", "#a7c957", "#6a994e", "#bc4749", "#2d5a37"),
  dracula: paletteCreator("#282a36", "#50fa7b", "#8be9fd", "#ff5555", "#6272a4"),
  gameboy: paletteCreator("#8b956d", "#4b5320", "#283015", "#121707", "#606b47"),
  monochrome: paletteCreator("#18181b", "#71717a", "#e4e4e7", "#f59e0b", "#3f3f46"),
  candy: paletteCreator("#26253a", "#f4a261", "#e76f51", "#2a9d8f", "#47436b"),
  D: paletteCreator("blue", "#e2b8b4", "#dc7f8e", "white", "purple"),
};

export default palettes;
