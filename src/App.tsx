import { useEffect, useState } from "react";

import { paletteNames, type PaletteName } from "./config/palettes.config";
import {
  difficultyLevels,
  difficultyNames,
  type DifficultyName,
  height,
  width,
} from "./config/game.config";
import { storageKeys } from "./config/storage.config";

import PaletteDropdown from "./components/PaletteDropdown";
import DifficultyPicker from "./components/DifficultyPicker";
import StatsBar from "./components/StatsBar";

import { usePersistedChoice } from "./hooks/usePersistedChoice";
import { useGame } from "./hooks/useGame";
import { useUiControls } from "./hooks/useUiControls";
import Overlay from "./components/Overlay";

function App() {
  //#region settings
  const [difficultyIndex, setDifficultyIndex, difficultyName] =
    usePersistedChoice(storageKeys.difficulty, difficultyNames, "medium");
  const speed = difficultyLevels[difficultyIndex];

  const [_paletteIndex, setPaletteIndex, paletteName] = usePersistedChoice(
    storageKeys.palette,
    paletteNames,
    "emerald",
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  //#endregion

  //#region game
  const { canvasRef, controlsRef, ticks, paused, death, length } = useGame({
    speed,
    paletteName,
  });

  useUiControls(controlsRef, {
    setPaletteIndex,
    setPaletteOpen,
    setDifficultyIndex,
  });

  const [highScore, setHighScore] = useState<number>(
    () => Number(localStorage.getItem(storageKeys.highScore)) || 0,
  );

  useEffect(() => {
    if (length > highScore) {
      setHighScore(length);
      localStorage.setItem(storageKeys.highScore, length.toString());
    }
  }, [length, highScore]);
  //#endregion

  //#region handlers
  const handleDifficulty = (name: DifficultyName) => {
    setDifficultyIndex(difficultyNames.indexOf(name));
  };

  const handlePalette = (name: PaletteName) => {
    setPaletteIndex(paletteNames.indexOf(name));
  };
  //#endregion

  return (
    <div className="bg-zinc-900 w-screen h-screen text-white flex flex-col font-mono select-none">
      <div className="flex justify-evenly items-center h-10 text-lg">
        <DifficultyPicker
          selected={difficultyName}
          onSelect={handleDifficulty}
        />

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

      <StatsBar score={length} time={ticks} highScore={highScore} />

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
