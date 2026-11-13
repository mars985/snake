import type { ACTION } from "./actions";
import type { KEYS } from "./keys";

export const MOVEMENT_DIRECTIONS = ["up", "right", "down", "left"] as const;
export type MovementDirection = (typeof MOVEMENT_DIRECTIONS)[number];

export type MovementKeys = Record<MovementDirection, readonly KEYS[]>;
export type MovementActions = Record<MovementDirection, ACTION>;

export interface MovementBindings {
  keys: MovementKeys;
  actions: MovementActions;
}

export const gameControlBindings: readonly (readonly [KEYS, ACTION])[] = [
  ["Escape", "pause"],
  ["Enter", "play"],
  ["Space", "toggle"],
  ["KeyR", "reset"],

  ["ButtonStart", "pause"],
  ["ButtonA", "play"],
  ["ButtonB", "toggle"],
  ["ButtonSelect", "reset"],
];

export const player1Movement: MovementBindings = {
  keys: {
    up: ["KeyW", "ArrowUp", "DPadUp", "LeftJoystickY-", "RightJoystickY-"],
    right: [
      "KeyD",
      "ArrowRight",
      "DPadRight",
      "LeftJoystickX+",
      "RightJoystickX+",
    ],
    down: [
      "KeyS",
      "ArrowDown",
      "DPadDown",
      "LeftJoystickY+",
      "RightJoystickY+",
    ],
    left: [
      "KeyA",
      "ArrowLeft",
      "DPadLeft",
      "LeftJoystickX-",
      "RightJoystickX-",
    ],
  },
  actions: {
    up: "moveUp1",
    right: "moveRight1",
    down: "moveDown1",
    left: "moveLeft1",
  },
};

export const uiBindings: readonly (readonly [KEYS, ACTION])[] = [
  ["KeyQ", "palettePrev"],
  ["KeyE", "paletteNext"],
  ["KeyP", "paletteToggle"],
];
