export type WASD_KEYS = "KeyW" | "KeyA" | "KeyS" | "KeyD";
export type ARROW_KEYS = "ArrowUp" | "ArrowLeft" | "ArrowDown" | "ArrowRight";
export type GAME_CONTROL_KEYS = "Escape" | "Space" | "Enter" | "KeyR";
export type PALETTE_KEYS = "KeyQ" | "KeyE" | "KeyP";
export type DIFFICULTY_KEYS = "KeyZ" | "KeyX";

export type KEYBOARD_KEYS =
  WASD_KEYS | ARROW_KEYS | GAME_CONTROL_KEYS | PALETTE_KEYS | DIFFICULTY_KEYS;

export type GAMEPAD_DPAD_KEYS =
  "DPadUp" | "DPadRight" | "DPadDown" | "DPadLeft";
export type GAMEPAD_LEFT_STICK_KEYS =
  "LeftJoystickY-" | "LeftJoystickX+" | "LeftJoystickY+" | "LeftJoystickX-";
export type GAMEPAD_RIGHT_STICK_KEYS =
  "RightJoystickY-" | "RightJoystickX+" | "RightJoystickY+" | "RightJoystickX-";
export type GAMEPAD_BUTTON_KEYS =
  "ButtonA" | "ButtonB" | "ButtonSelect" | "ButtonStart";

export type GAMEPAD_KEYS =
  | GAMEPAD_DPAD_KEYS
  | GAMEPAD_LEFT_STICK_KEYS
  | GAMEPAD_RIGHT_STICK_KEYS
  | GAMEPAD_BUTTON_KEYS;

export type KEYS = KEYBOARD_KEYS | GAMEPAD_KEYS;
