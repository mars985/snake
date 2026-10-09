import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Game } from './models/Game';
import type { GridStyle } from './models/GridRenderer';
import { Directions } from './models/Snake';
import palettes, { type Palette } from "./models/palettes";

const rows = 20;
const cols = 40;

const cellSize = 30;
const width = cellSize * cols;
const height = cellSize * rows;

const gridStyle: GridStyle = {
  borderColor: "black",
  borderWidth: 1,
  cellSize,
};

const difficulty = {
  easy: 5,
  medium: 10,
  hard: 15
};

const DEFAULT_CUSTOM_PALETTE: Palette = {
  empty: "#0f172a",
  snakeBody: "#22c55e",
  snakeHead: "#15803d",
  fruit: "#ef4444",
  wall: "#334155",
};

const COLOR_FIELDS: { key: keyof Palette; label: string; desc: string }[] = [
  { key: "empty", label: "Background", desc: "Empty grid tiles" },
  { key: "snakeBody", label: "Snake Body", desc: "Body segments" },
  { key: "snakeHead", label: "Snake Head", desc: "Head direction indicator" },
  { key: "fruit", label: "Fruit", desc: "Food / target" },
  { key: "wall", label: "Wall", desc: "Obstacles & boundary" },
];

function toHexColor(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  const named: Record<string, string> = {
    blue: "#0000ff",
    white: "#ffffff",
    purple: "#800080",
    black: "#000000",
    red: "#ff0000",
    green: "#008000",
    yellow: "#ffff00",
  };
  return named[color.toLowerCase()] || "#ffffff";
}

function App() {
  const [ticks, setTicks] = useState(0);
  const [paused, setPaused] = useState(true);
  const [death, setDeath] = useState(false);
  const [length, setLength] = useState(1);
  const [highScore, setHighScore] = useState<number>(() => Number(localStorage.getItem("highScore")) || 0);
  const [speed, setSpeed] = useState(difficulty.hard);

  const [customPalette, setCustomPalette] = useState<Palette>(() => {
    try {
      const saved = localStorage.getItem("snakeCustomPalette");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.empty && parsed.snakeBody && parsed.snakeHead && parsed.fruit && parsed.wall) {
          return parsed;
        }
      }
    } catch {
      // fallback to default custom
    }
    return DEFAULT_CUSTOM_PALETTE;
  });

  const [paletteKey, setPaletteKey] = useState<string>(() => {
    const saved = localStorage.getItem("snakePalette");
    if (saved === "custom") return "custom";
    return saved && saved in palettes ? saved : "emerald";
  });

  const [activeTab, setActiveTab] = useState<"presets" | "custom">(() => {
    const saved = localStorage.getItem("snakePalette");
    return saved === "custom" ? "custom" : "presets";
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initialPalette = paletteKey === "custom"
      ? customPalette
      : (palettes[paletteKey] || palettes.default);

    gameRef.current = new Game({
      rows,
      cols,
      snakeHead: { row: 3, col: 3 },
      snakeLength: 1,
      snakeDirection: Directions.right,
      ctx,
      palette: initialPalette,
      gridStyle,
      paused: true,
      ticksPerSec: difficulty.hard,
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
    setHighScore((prev) => {
      if (length > prev) {
        localStorage.setItem("highScore", length.toString());
        return length;
      }
      return prev;
    });
  }, [length]);

  const handleSpeed = (val: number) => {
    gameRef.current?.setSpeed(val);
    setSpeed(val);
  };

  const handlePaletteSelect = (key: string) => {
    const pal = palettes[key];
    if (!pal) return;
    setPaletteKey(key);
    localStorage.setItem("snakePalette", key);
    gameRef.current?.setPalette(pal);
  };

  const handleCustomColorChange = (key: keyof Palette, color: string) => {
    const updated: Palette = {
      ...customPalette,
      [key]: color,
    };
    setCustomPalette(updated);
    setPaletteKey("custom");
    localStorage.setItem("snakeCustomPalette", JSON.stringify(updated));
    localStorage.setItem("snakePalette", "custom");
    gameRef.current?.setPalette(updated);
  };

  const handleSelectCustom = () => {
    setPaletteKey("custom");
    localStorage.setItem("snakePalette", "custom");
    gameRef.current?.setPalette(customPalette);
  };

  const handleClonePresetToCustom = (presetKey: string) => {
    const preset = palettes[presetKey];
    if (!preset) return;
    const updated: Palette = { ...preset };
    setCustomPalette(updated);
    setPaletteKey("custom");
    localStorage.setItem("snakeCustomPalette", JSON.stringify(updated));
    localStorage.setItem("snakePalette", "custom");
    gameRef.current?.setPalette(updated);
  };

  const handleResetCustom = () => {
    setCustomPalette(DEFAULT_CUSTOM_PALETTE);
    setPaletteKey("custom");
    localStorage.setItem("snakeCustomPalette", JSON.stringify(DEFAULT_CUSTOM_PALETTE));
    localStorage.setItem("snakePalette", "custom");
    gameRef.current?.setPalette(DEFAULT_CUSTOM_PALETTE);
  };

  const handleResume = () => {
    gameRef.current?.play();
  };

  const handleRestart = () => {
    gameRef.current?.reset();
  };

  return (
    <div className="bg-zinc-800 w-screen h-screen text-white flex flex-col font-mono relative overflow-hidden select-none">

      <div className="flex justify-center items-center gap-4 h-10 text-lg shrink-0">
        <button
          className={`hover:underline cursor-pointer ${speed === difficulty.easy ? "text-green-400" : "text-white"}`}
          onClick={() => handleSpeed(difficulty.easy)}
        >
          Easy
        </button>

        <button
          className={`hover:underline cursor-pointer ${speed === difficulty.medium ? "text-red-400" : "text-white"}`}
          onClick={() => handleSpeed(difficulty.medium)}
        >
          Medium
        </button>

        <button
          className={`hover:underline cursor-pointer ${speed === difficulty.hard ? "text-purple-400" : "text-white"}`}
          onClick={() => handleSpeed(difficulty.hard)}
        >
          Hard
        </button>
      </div>

      <div className="flex justify-center items-center flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          height={height}
          width={width}
          className="border border-zinc-700 shadow-2xl max-w-full max-h-full object-contain"
        />
      </div>

      <div className="grid grid-cols-3 ml-5 mr-5 py-2 text-lg shrink-0">
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

      {paused && !death && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-20 p-4">
          <div className="bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-6 shadow-2xl max-w-md w-full text-center flex flex-col gap-4">
            <div>
              <div className="inline-block px-3 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider rounded-full mb-1">
                Paused
              </div>
              <h2 className="text-2xl font-bold tracking-wider text-white">
                GAME PAUSED
              </h2>
              <p className="text-zinc-400 text-xs mt-1">
                Press <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-300">Space</kbd> or click Resume
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold px-5 py-2 rounded-lg transition-all cursor-pointer text-sm shadow-md"
                onClick={(e) => {
                  (e.currentTarget as HTMLElement).blur();
                  handleResume();
                }}
              >
                ▶ Resume Game
              </button>
              <button
                className="bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 hover:text-white px-4 py-2 rounded-lg transition-all cursor-pointer text-sm border border-zinc-700"
                onClick={(e) => {
                  (e.currentTarget as HTMLElement).blur();
                  handleRestart();
                }}
              >
                ↺ Restart (R)
              </button>
            </div>

            <div className="border-t border-zinc-800 pt-3 text-left">
              {/* Tabs for Presets and Custom */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <div className="flex gap-2 text-xs font-semibold">
                  <button
                    className={`pb-1 px-1 transition-colors cursor-pointer border-b-2 ${
                      activeTab === "presets"
                        ? "text-emerald-400 border-emerald-400 font-bold"
                        : "text-zinc-400 border-transparent hover:text-zinc-200"
                    }`}
                    onClick={(e) => {
                      (e.currentTarget as HTMLElement).blur();
                      setActiveTab("presets");
                    }}
                  >
                    Presets
                  </button>

                  <button
                    className={`pb-1 px-1 transition-colors cursor-pointer border-b-2 flex items-center gap-1 ${
                      activeTab === "custom"
                        ? "text-emerald-400 border-emerald-400 font-bold"
                        : "text-zinc-400 border-transparent hover:text-zinc-200"
                    }`}
                    onClick={(e) => {
                      (e.currentTarget as HTMLElement).blur();
                      setActiveTab("custom");
                      handleSelectCustom();
                    }}
                  >
                    <span>Custom Picker</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-emerald-400 inline-block" />
                    {paletteKey === "custom" && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded">Active</span>
                    )}
                  </button>
                </div>

                <span className="text-[10px] text-zinc-500">
                  Live preview
                </span>
              </div>

              {activeTab === "presets" ? (
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(palettes).map(([key, pal]) => {
                    const isSelected = key === paletteKey;
                    return (
                      <button
                        key={key}
                        onClick={(e) => {
                          (e.currentTarget as HTMLElement).blur();
                          handlePaletteSelect(key);
                        }}
                        className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-zinc-800 border-emerald-500 ring-2 ring-emerald-500/50 shadow-md"
                            : "bg-zinc-950/70 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className={`text-xs truncate capitalize ${isSelected ? "text-emerald-400 font-bold" : "text-zinc-300"}`}>
                            {key}
                          </span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 ml-1" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 w-full p-1 bg-black/40 rounded border border-zinc-800/80">
                          <span
                            title="Background"
                            className="w-3.5 h-3.5 rounded-xs border border-white/20 shrink-0"
                            style={{ backgroundColor: pal.empty }}
                          />
                          <span
                            title="Snake Body"
                            className="w-3.5 h-3.5 rounded-xs border border-white/20 shrink-0"
                            style={{ backgroundColor: pal.snakeBody }}
                          />
                          <span
                            title="Snake Head"
                            className="w-3.5 h-3.5 rounded-xs border border-white/20 shrink-0"
                            style={{ backgroundColor: pal.snakeHead }}
                          />
                          <span
                            title="Fruit"
                            className="w-3.5 h-3.5 rounded-xs border border-white/20 shrink-0"
                            style={{ backgroundColor: pal.fruit }}
                          />
                          <span
                            title="Wall"
                            className="w-3.5 h-3.5 rounded-xs border border-white/20 shrink-0"
                            style={{ backgroundColor: pal.wall }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Live preview strip of custom palette */}
                  <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg border border-zinc-800">
                    <span className="text-[11px] text-zinc-400">Current Custom Colors:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        title="Background"
                        className="w-4 h-4 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: customPalette.empty }}
                      />
                      <span
                        title="Snake Body"
                        className="w-4 h-4 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: customPalette.snakeBody }}
                      />
                      <span
                        title="Snake Head"
                        className="w-4 h-4 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: customPalette.snakeHead }}
                      />
                      <span
                        title="Fruit"
                        className="w-4 h-4 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: customPalette.fruit }}
                      />
                      <span
                        title="Wall"
                        className="w-4 h-4 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: customPalette.wall }}
                      />
                    </div>
                  </div>

                  {/* 5 individual color pickers */}
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {COLOR_FIELDS.map(({ key, label, desc }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold text-zinc-200">{label}</span>
                          <span className="text-[10px] text-zinc-500">{desc}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-zinc-400 uppercase">
                            {customPalette[key]}
                          </span>
                          <input
                            type="color"
                            value={toHexColor(customPalette[key])}
                            onChange={(e) => handleCustomColorChange(key, e.target.value)}
                            className="w-7 h-7 rounded border border-zinc-600 bg-transparent cursor-pointer p-0.5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Helper Actions: Clone from preset or reset */}
                  <div className="flex items-center justify-between pt-1 gap-2 text-[11px]">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <span>Copy:</span>
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleClonePresetToCustom(e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded px-1.5 py-0.5 text-[11px] cursor-pointer"
                      >
                        <option value="" disabled>Select preset...</option>
                        {Object.keys(palettes).map((k) => (
                          <option key={k} value={k} className="capitalize">
                            {k}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleResetCustom}
                      className="text-zinc-400 hover:text-zinc-200 underline cursor-pointer text-[10px]"
                    >
                      Reset Colors
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-zinc-500 text-xs border-t border-zinc-800/60 pt-2">
              Move: <span className="text-zinc-400">Arrows</span> &nbsp;•&nbsp; Pause: <span className="text-zinc-400">Space / Esc</span>
            </div>
          </div>
        </div>
      )}

      {death && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-20 p-4">
          <div className="bg-zinc-900 border border-red-900/60 rounded-2xl p-6 text-center shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full">
            <div className="inline-block px-3 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold uppercase tracking-wider rounded-full">
              Collision
            </div>
            <div className="text-red-500 text-3xl font-bold tracking-wide">
              YOU DIED
            </div>
            <div className="text-zinc-400 text-sm">
              Score: <span className="text-white font-bold">{length}</span> &nbsp;|&nbsp; High Score: <span className="text-emerald-400 font-bold">{highScore}</span>
            </div>
            <button
              className="mt-1 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-semibold px-6 py-2 rounded-lg transition-all cursor-pointer text-sm shadow-md"
              onClick={(e) => {
                (e.currentTarget as HTMLElement).blur();
                handleRestart();
              }}
            >
              Play Again
            </button>
            <div className="text-zinc-500 text-xs">
              Press <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Enter</kbd> or <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">R</kbd> to restart
            </div>
          </div>
        </div>
      )}

      <a
        className="mb-2 mx-auto hover:underline hover:text-blue-300 text-xs text-zinc-400 shrink-0"
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