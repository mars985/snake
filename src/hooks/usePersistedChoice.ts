import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function usePersistedChoice<T extends string>(
  key: string,
  options: readonly T[],
  fallback: T,
): [number, Dispatch<SetStateAction<number>>, T] {
  const [index, setIndex] = useState<number>(() => {
    const saved = localStorage.getItem(key);
    const savedIndex = options.indexOf(saved as T);
    return savedIndex >= 0 ? savedIndex : options.indexOf(fallback);
  });

  const name = options[index];

  useEffect(() => {
    localStorage.setItem(key, name);
  }, [key, name]);

  return [index, setIndex, name];
}
