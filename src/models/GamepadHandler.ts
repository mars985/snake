
export class GamepadHandler {
    private readonly deadzone = 0.5;
    private readonly previousStates = new Map<string, boolean>();

    poll(keyMap: Record<string, () => void>): void {
        const gamepads = navigator.getGamepads();

        for (const gamepad of gamepads) {
            if (!gamepad || !gamepad.connected) continue;

            const controls: [string, boolean][] = [
                ["DPadUp", !!gamepad.buttons[12]?.pressed],
                ["DPadRight", !!gamepad.buttons[15]?.pressed],
                ["DPadDown", !!gamepad.buttons[13]?.pressed],
                ["DPadLeft", !!gamepad.buttons[14]?.pressed],

                ["LeftJoystickY-", (gamepad.axes[1] ?? 0) < -this.deadzone],
                ["LeftJoystickX+", (gamepad.axes[0] ?? 0) > this.deadzone],
                ["LeftJoystickY+", (gamepad.axes[1] ?? 0) > this.deadzone],
                ["LeftJoystickX-", (gamepad.axes[0] ?? 0) < -this.deadzone],

                ["RightJoystickY-", (gamepad.axes[3] ?? 0) < -this.deadzone],
                ["RightJoystickX+", (gamepad.axes[2] ?? 0) > this.deadzone],
                ["RightJoystickY+", (gamepad.axes[3] ?? 0) > this.deadzone],
                ["RightJoystickX-", (gamepad.axes[2] ?? 0) < -this.deadzone],

                ["ButtonA", !!gamepad.buttons[0]?.pressed],
                ["ButtonB", !!gamepad.buttons[1]?.pressed],
                ["ButtonSelect", !!gamepad.buttons[8]?.pressed],
                ["ButtonStart", !!gamepad.buttons[9]?.pressed]
            ];

            for (const [key, pressed] of controls) {
                const stateKey = `${gamepad.index}:${key}`;
                const wasPressed = this.previousStates.get(stateKey) ?? false;

                if (pressed && !wasPressed) {
                    keyMap[key]?.();
                }

                this.previousStates.set(stateKey, pressed);
            }
        }
    }
}
