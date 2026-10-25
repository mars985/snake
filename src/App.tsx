import { useEffect, useRef, useState } from 'react';

import { Game } from './models/Game';
import { Directions } from './models/Snake';

import { palettes, type PaletteName } from './config/palettes.config';
import {difficulty, rows, cols, height, width, gridStyle, snakeHeadStartPosition} from './config/game.config';

import PaletteDropdown from './PaletteDropdown';

function App() {
  const [ticks, setTicks] = useState(0);
  const [paused, setPaused] = useState(true);
  const [death, setDeath] = useState(false);
  const [length, setLength] = useState(1);
  const [highScore, setHighScore] = useState<number>(() => Number(localStorage.getItem("highScore")) || 0);
  const [speed, setSpeed] = useState(difficulty.medium);
  const [paletteName, setPaletteName] = useState<PaletteName>(() => {
    const saved = localStorage.getItem("palette");
    return saved && saved in palettes ? saved as PaletteName : "emerald";
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
      setTicks
    });

    return () => {
      gameRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (length > highScore) {
      setHighScore(length);
      localStorage.setItem("highScore", length.toString());
    }
  }, [length, highScore]);

  const handleSpeed = (val: number) => {
    gameRef.current?.setSpeed(val);
    setSpeed(val);
  }

  const handlePalette = (name: PaletteName) => {
    gameRef.current?.setPalette(palettes[name]);
    setPaletteName(name);
    localStorage.setItem("palette", name);
  }

  return (
    <div className="bg-zinc-900 w-screen h-screen text-white flex flex-col font-mono select-none">

      <div className="flex justify-evenly items-center h-10 text-lg">
        <div>
          Difficulty:{" "}
          <span className="inline-flex gap-4">
            <button
              className={`hover:underline ${speed === difficulty.easy ? "text-green-400" : "text-white"}`}
              onClick={() => handleSpeed(difficulty.easy)}
            >
              Easy
            </button>

            <button
              className={`hover:underline ${speed === difficulty.medium ? "text-red-400" : "text-white"}`}
              onClick={() => handleSpeed(difficulty.medium)}
            >
              Medium
            </button>

            <button
              className={`hover:underline ${speed === difficulty.hard ? "text-purple-400" : "text-white"}`}
              onClick={() => handleSpeed(difficulty.hard)}
            >
              Hard
            </button>
          </span>
        </div>

        <PaletteDropdown value={paletteName} onChange={handlePalette} />
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          height={height}
          width={width}
        />
      </div>

      <div className="grid grid-cols-3 ml-5 mr-5 py-2 text-lg">
        <div className="text-left">
          Score: {length}
        </div>

        <div className="text-center">
          Time: {ticks}
        </div>

        <div className="text-right">
          High Score: {highScore}
        </div>
      </div>

      {paused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black w-40 h-20 flex items-center justify-center text-xl">
            PAUSED
          </div>
        </div>
      )}

      {death && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black w-40 h-20 flex items-center justify-center text-red-500 text-2xl">
            YOU DIED
          </div>
        </div>
      )}

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