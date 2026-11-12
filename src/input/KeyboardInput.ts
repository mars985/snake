import type { KEYS } from "./keys";

export class KeyboardInput {
  private callbacks = new Set<(key: KEYS) => void>();

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  public subscribe(cb: (key: KEYS) => void): () => void {
    this.callbacks.add(cb);

    return () => {
      this.callbacks.delete(cb);
    };
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const code = event.code;
    this.callbacks.forEach((cb) => cb(code as KEYS));
  };

  public destroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    this.callbacks.clear();
  }
}
