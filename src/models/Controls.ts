export const DirectionalControls = {
    up: ["ArrowUp", "KeyW", "DPadUp", "LeftJoystickY-", "RightJoystickY-"],
    right: ["ArrowRight", "KeyD", "DPadRight", "LeftJoystickX+", "RightJoystickX+"],
    down: ["ArrowDown", "KeyS", "DPadDown", "LeftJoystickY+", "RightJoystickY+"],
    left: ["ArrowLeft", "KeyA", "DPadLeft", "LeftJoystickX-", "RightJoystickX-"]
} as const;


export const ActionControls = {
    pause: ["Escape", "ButtonStart"],
    togglePause: ["Space", "ButtonB"],
    play: ["Enter", "ButtonA"],
    reset: ["KeyR", "ButtonSelect"]
} as const;