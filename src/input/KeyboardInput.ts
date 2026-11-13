import type { KEYS } from "./keys";

export class KeyboardInput {
  private callbacks = new Set<(key: KEYS) => boolean>();

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  public subscribe(cb: (key: KEYS) => boolean): () => void {
    this.callbacks.add(cb);

    return () => {
      this.callbacks.delete(cb);
    };
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;

    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }

    let handled = false;

    this.callbacks.forEach((cb) => {
      if (cb(event.code as KEYS)) handled = true;
    });

    if (handled) event.preventDefault();
  };

  public destroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    this.callbacks.clear();
  }
}
