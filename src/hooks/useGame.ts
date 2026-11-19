import { useEffect, useRef, useState } from "react";

import { Game } from "../game/Game";
import { Directions } from "../game/Snake";
import { Controls } from "../input/Controls";
import { KeyboardInput } from "../input/KeyboardInput";
import { GamepadInput } from "../input/GamepadInput";
import { palettes, type PaletteName } from "../config/palettes.config";
import {
  rows,
  cols,
  gridStyle,
  snakeHeadStartPosition,
  snakeStartLength,
  snakeGrowIncrement
} from "../config/game.config";

interface UseGameOptions {
  speed: number;
  paletteName: PaletteName;
}

export function useGame({ speed, paletteName }: UseGameOptions) {
  const [ticks, setTicks] = useState(0);
  const [paused, setPaused] = useState(true);
  const [death, setDeath] = useState(false);
  const [length, setLength] = useState(snakeStartLength);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef<Controls | null>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const keyboard = new KeyboardInput();
    const gamepad = new GamepadInput();
    controlsRef.current = new Controls({ inputs: [keyboard, gamepad] });

    gameRef.current = new Game({
      rows,
      cols,
      snakeHead: snakeHeadStartPosition,
      snakeLength: length,
      growIncrement: snakeGrowIncrement,
      snakeDirection: Directions.right,
      ctx,
      palette: palettes[paletteName],
      gridStyle,
      paused: true,
      ticksPerSec: speed,
      setDeath,
      setPaused,
      setLength,
      setTicks,
      controls: controlsRef.current,
    });

    return () => {
      keyboard.destroy();
      gamepad.destroy();
      controlsRef.current?.destroy();
      gameRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    gameRef.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    gameRef.current?.setPalette(palettes[paletteName]);
  }, [paletteName]);

  return { canvasRef, controlsRef, ticks, paused, death, length };
}
