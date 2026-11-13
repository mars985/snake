import { useEffect, useRef, useState } from "react";

import { Game } from "./models/Game";
import { Directions } from "./models/Snake";

import {
  palettes,
  paletteNames,
  type PaletteName,
} from "./config/palettes.config";
import {
  difficulty,
  difficultyLevels,
  difficultyNames,
  difficultyColors,
  rows,
  cols,
  height,
  width,
  gridStyle,
  snakeHeadStartPosition,
} from "./config/game.config";

import PaletteDropdown from "./PaletteDropdown";
import Overlay from "./Overlay";
import { usePersistedChoice } from "./hooks/usePersistedChoice";
import { Controls } from "./input/Controls";
import { KeyboardInput } from "./input/KeyboardInput";
import { GamepadInput } from "./input/GamepadInput";
import { uiBindings } from "./input/bindings";

function App() {
  //#region game properties
  const [ticks, setTicks] = useState(0);
  const [paused, setPaused] = useState(true);
  const [death, setDeath] = useState(false);
  const [length, setLength] = useState(1);
  const [highScore, setHighScore] = useState<number>(
    () => Number(localStorage.getItem("highScore")) || 0,
  );
  //#endregion

  //#region game settings
  const [difficultyIndex, setDifficultyIndex] = usePersistedChoice(
    "difficulty",
    difficultyNames,
    "medium",
  );
  const speed = difficultyLevels[difficultyIndex];

  const [, setPaletteIndex, paletteName] = usePersistedChoice(
    "palette",
    paletteNames,
    "emerald",
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  //#endregion

  //#region refs and setup
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
  //#endregion

  //#region controls
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const paletteCount = paletteNames.length;
    const difficultyCount = difficultyLevels.length;

    const unsubscribers = [
      ...uiBindings.map(([key, action]) => controls.bind(key, action)),

      controls.subscribe("paletteNext", () =>
        setPaletteIndex((i) => (i + 1) % paletteCount),
      ),
      controls.subscribe("palettePrev", () =>
        setPaletteIndex((i) => (i - 1 + paletteCount) % paletteCount),
      ),
      controls.subscribe("paletteToggle", () =>
        setPaletteOpen((open) => !open),
      ),
      controls.subscribe("difficultyUp", () =>
        setDifficultyIndex((i) => Math.min(i + 1, difficultyCount - 1)),
      ),
      controls.subscribe("difficultyDown", () =>
        setDifficultyIndex((i) => Math.max(i - 1, 0)),
      ),
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [setDifficultyIndex, setPaletteIndex]);

  const handleSpeed = (val: number) => {
    setDifficultyIndex(difficultyLevels.indexOf(val));
  };

  const handlePalette = (name: PaletteName) => {
    setPaletteIndex(paletteNames.indexOf(name));
  };
  //#endregion

  //#region side effects
  useEffect(() => {
    gameRef.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    gameRef.current?.setPalette(palettes[paletteName]);
  }, [paletteName]);

  useEffect(() => {
    if (length > highScore) {
      setHighScore(length);
      localStorage.setItem("highScore", length.toString());
    }
  }, [length, highScore]);
  //#endregion

  return (
    <div className="bg-zinc-900 w-screen h-screen text-white flex flex-col font-mono select-none">
      <div className="flex justify-evenly items-center h-10 text-lg">
        <div>
          Difficulty:{" "}
          <span className="inline-flex gap-4">
            {difficultyNames.map((name) => (
              <button
                key={name}
                className={`hover:underline capitalize ${speed === difficulty[name] ? difficultyColors[name] : "text-white"}`}
                onClick={() => handleSpeed(difficulty[name])}
              >
                {name}
              </button>
            ))}
          </span>
        </div>

        <PaletteDropdown
          selected={paletteName}
          onSelect={handlePalette}
          isOpen={paletteOpen}
          setOpen={setPaletteOpen}
        />
      </div>

      <div className="flex justify-center">
        <canvas ref={canvasRef} height={height} width={width} />
      </div>

      <div className="grid grid-cols-3 ml-5 mr-5 py-2 text-lg">
        <div className="text-left">Score: {length}</div>

        <div className="text-center">Time: {ticks}</div>

        <div className="text-right">High Score: {highScore}</div>
      </div>

      {paused && <Overlay className="text-xl">PAUSED</Overlay>}

      {death && <Overlay className="text-red-500 text-2xl">YOU DIED</Overlay>}

      <a
        className="m-auto hover:underline hover:text-blue-300"
        href="https://github.com/mars985/snake"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </div>
  );
}

export default App;
