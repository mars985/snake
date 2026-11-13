import { useEffect, useRef } from "react";
import {
  palettes,
  paletteNames,
  type Palette,
  type PaletteName,
} from "../config/palettes.config";

interface PaletteDropdownProps {
  selected: PaletteName;
  onSelect: (name: PaletteName) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

function Swatches({ palette }: { palette: Palette }) {
  return (
    <span className="flex gap-0.5">
      {Object.values(palette).map((color, i) => (
        <span key={i} className="w-3 h-3" style={{ backgroundColor: color }} />
      ))}
    </span>
  );
}

function PaletteDropdown({
  selected,
  onSelect,
  isOpen,
  setOpen,
}: PaletteDropdownProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setOpen]);

  const select = (name: PaletteName) => {
    onSelect(name);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        className="hover:underline"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen(!isOpen)}
      >
        Palette:{" "}
        <span style={{ color: palettes[selected].snakeBody }}>
          {capitalize(selected)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-10 bg-black py-1">
          {paletteNames.map((name) => (
            <button
              key={name}
              className="w-full flex items-center justify-between gap-4 px-3 py-0.5 hover:underline"
              style={{
                color: name === selected ? palettes[name].snakeBody : "white",
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(name)}
            >
              {capitalize(name)}
              <Swatches palette={palettes[name]} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaletteDropdown;
