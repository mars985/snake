export type DIRECTIONAL_ACTION_PLAYER_1 =
  "moveUp1" | "moveDown1" | "moveLeft1" | "moveRight1";

export type DIRECTIONAL_ACTION_PLAYER_2 =
  "moveUp2" | "moveDown2" | "moveLeft2" | "moveRight2";

export type DIFFICULTY_ACTION = "difficultyUp" | "difficultyDown";

export type PALETTE_ACTION = "paletteNext" | "palettePrev" | "paletteToggle";

export type GAME_CONTROL_ACTION = "pause" | "play" | "toggle" | "reset";

export type ACTION =
  | DIRECTIONAL_ACTION_PLAYER_1
  | DIRECTIONAL_ACTION_PLAYER_2
  | PALETTE_ACTION
  | DIFFICULTY_ACTION
  | GAME_CONTROL_ACTION;
