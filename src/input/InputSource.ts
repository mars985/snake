import type { KEYS } from "./keys";

export interface InputSource {
  subscribe(cb: (key: KEYS) => boolean): () => void;
  destroy(): void;
}
