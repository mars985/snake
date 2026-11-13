import type { GAMEPAD_KEYS, KEYS } from "./keys";
import type { InputSource } from "./InputSource";

export class GamepadInput implements InputSource {
  private readonly deadzone = 0.5;
  private readonly previousStates = new Map<string, boolean>();
  private callbacks = new Set<(key: KEYS) => boolean>();
  private frameId: number | null = null;

  constructor() {
    this.frameId = requestAnimationFrame(this.poll);
  }

  public subscribe(cb: (key: KEYS) => boolean): () => void {
    this.callbacks.add(cb);

    return () => {
      this.callbacks.delete(cb);
    };
  }

  private poll = (): void => {
    for (const gamepad of navigator.getGamepads()) {
      if (!gamepad || !gamepad.connected) continue;

      const axis = (i: number) => gamepad.axes[i] ?? 0;
      const button = (i: number) => gamepad.buttons[i]?.pressed ?? false;

      const controls: [GAMEPAD_KEYS, boolean][] = [
        ["DPadUp", button(12)],
        ["DPadRight", button(15)],
        ["DPadDown", button(13)],
        ["DPadLeft", button(14)],

        ["LeftJoystickY-", axis(1) < -this.deadzone],
        ["LeftJoystickX+", axis(0) > this.deadzone],
        ["LeftJoystickY+", axis(1) > this.deadzone],
        ["LeftJoystickX-", axis(0) < -this.deadzone],

        ["RightJoystickY-", axis(3) < -this.deadzone],
        ["RightJoystickX+", axis(2) > this.deadzone],
        ["RightJoystickY+", axis(3) > this.deadzone],
        ["RightJoystickX-", axis(2) < -this.deadzone],

        ["ButtonA", button(0)],
        ["ButtonB", button(1)],
        ["ButtonSelect", button(8)],
        ["ButtonStart", button(9)],
      ];

      for (const [key, pressed] of controls) {
        const stateKey = `${gamepad.index}:${key}`;
        const wasPressed = this.previousStates.get(stateKey) ?? false;

        if (pressed && !wasPressed) {
          this.callbacks.forEach((cb) => cb(key));
        }

        this.previousStates.set(stateKey, pressed);
      }
    }

    this.frameId = requestAnimationFrame(this.poll);
  };

  public destroy(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    this.callbacks.clear();
    this.previousStates.clear();
  }
}
