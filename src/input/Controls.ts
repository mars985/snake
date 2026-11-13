import type { ACTION } from "./actions";
import type { InputSource } from "./InputSource";
import type { KEYS } from "./keys";

interface ControlsOptions {
  inputs: InputSource[];
}

export class Controls {
  private bindings = new Map<KEYS, Set<ACTION>>();
  private callbacks = new Map<ACTION, Set<() => void>>();

  private unsubscribers: (() => void)[];

  constructor(options: ControlsOptions) {
    this.unsubscribers = options.inputs.map((input) =>
      input.subscribe(this.handleInput),
    );
  }

  private handleInput = (key: KEYS): boolean => {
    const actions = this.bindings.get(key);
    if (!actions || actions.size === 0) return false;

    actions.forEach((action) => this.emit(action));
    return true;
  };

  public bind(key: KEYS, action: ACTION) {
    if (!this.bindings.has(key)) {
      this.bindings.set(key, new Set());
    }

    const keyBinds = this.bindings.get(key)!;
    keyBinds.add(action);

    const unbind = () => {
      keyBinds.delete(action);

      if (keyBinds.size === 0) {
        this.bindings.delete(key);
      }
    };

    return unbind;
  }

  public subscribe(action: ACTION, cb: () => void): () => void {
    if (!this.callbacks.has(action)) {
      this.callbacks.set(action, new Set());
    }

    const subscribers = this.callbacks.get(action)!;
    subscribers.add(cb);

    const unsubscribe = () => {
      subscribers.delete(cb);

      if (subscribers.size === 0) {
        this.callbacks.delete(action);
      }
    };

    return unsubscribe;
  }

  private emit(action: ACTION): void {
    this.callbacks.get(action)?.forEach((cb) => cb());
  }

  public destroy(): void {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];

    this.callbacks.clear();
    this.bindings.clear();
  }
}
