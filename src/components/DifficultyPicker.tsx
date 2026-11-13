import {
  difficultyColors,
  difficultyNames,
  type DifficultyName,
} from "../config/game.config";

interface DifficultyPickerProps {
  selected: DifficultyName;
  onSelect: (name: DifficultyName) => void;
}

function DifficultyPicker({ selected, onSelect }: DifficultyPickerProps) {
  return (
    <div>
      Difficulty:{" "}
      <span className="inline-flex gap-4">
        {difficultyNames.map((name) => (
          <button
            key={name}
            className={`hover:underline capitalize ${name === selected ? difficultyColors[name] : "text-white"}`}
            onClick={() => onSelect(name)}
          >
            {name}
          </button>
        ))}
      </span>
    </div>
  );
}

export default DifficultyPicker;
