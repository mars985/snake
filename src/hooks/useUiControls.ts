import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

import type { Controls } from "../input/Controls";
import { uiBindings } from "../input/bindings";
import { paletteNames } from "../config/palettes.config";
import { difficultyLevels } from "../config/game.config";

interface UiControlSetters {
  setPaletteIndex: Dispatch<SetStateAction<number>>;
  setPaletteOpen: Dispatch<SetStateAction<boolean>>;
  setDifficultyIndex: Dispatch<SetStateAction<number>>;
}

export function useUiControls(
  controlsRef: RefObject<Controls | null>,
  { setPaletteIndex, setPaletteOpen, setDifficultyIndex }: UiControlSetters,
) {
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
  }, [controlsRef, setPaletteIndex, setPaletteOpen, setDifficultyIndex]);
}
