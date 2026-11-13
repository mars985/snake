import { Board, type BoardEvent, type BoardOptions } from "./Board";
import { GridRenderer, type GridRendererOptions } from "./GridRenderer";
import { Directions } from "./Snake";
import type { Palette } from "../config/palettes.config";
import type { Controls } from "../input/Controls";
import {
  gameControlBindings,
  MOVEMENT_DIRECTIONS,
  player1Movement,
  type MovementBindings,
} from "../input/bindings";

export interface GameOptions extends BoardOptions, GridRendererOptions {
  controls: Controls;
  paused?: boolean;
  ticksPerSec?: number;
  setPaused?: (paused: boolean) => void;
  setDeath?: (death: boolean) => void;
  setLength?: (length: number) => void;
  setTicks?: (ticks: number) => void;
}

export class Game {
  private options: GameOptions;
  private board: Board;
  private renderer: GridRenderer;

  private paused: boolean;
  private died: boolean;

  private ticksPerSec: number;
  private loopId: number | null;
  private ticks: number;

  private setDeath: (death: boolean) => void;
  private setPaused: (paused: boolean) => void;
  private setLength: (length: number) => void;
  private setTicks: (ticks: number) => void;

  private controls: Controls;
  private unsubscribers: (() => void)[] = [];

  //#region setup
  constructor(options: GameOptions) {
    this.options = options;
    this.board = new Board(options);
    this.renderer = new GridRenderer(options);

    this.ticksPerSec = options.ticksPerSec ?? 2;
    this.loopId = null;
    this.ticks = 0;

    this.died = false;
    this.paused = options.paused ?? true;

    this.setDeath = options.setDeath ?? (() => {});
    this.setPaused = options.setPaused ?? (() => {});
    this.setLength = options.setLength ?? (() => {});
    this.setTicks = options.setTicks ?? (() => {});

    this.controls = options.controls;
    this.setupControls();

    this.board.addFruit();
    this.setSpeed(this.ticksPerSec);

    this.render();
  }

  destroy(): void {
    this.pause();
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
  }
  //#endregion

  //#region game controls
  play(): void {
    if (!this.paused || this.loopId !== null || this.died) return;

    this.paused = false;
    this.setPaused(this.paused);
    this.loopId = setTimeout(() => this.loop(), 1000 / this.ticksPerSec);
  }

  pause(): void {
    this.paused = true;
    if (this.loopId !== null) {
      clearTimeout(this.loopId);
      this.loopId = null;
      this.setPaused(this.paused);
    }
  }

  togglePause(): void {
    if (this.paused) this.play();
    else this.pause();
  }

  reset(): void {
    const options = this.options;
    this.board = new Board(options);
    this.renderer = new GridRenderer(options);

    this.loopId = null;
    this.ticks = 0;

    this.board.addFruit();

    this.died = false;
    this.paused = options.paused ?? true;
    this.ticks = 0;

    this.setDeath(this.died);
    this.setPaused(this.paused);
    this.setLength(this.board.snakeLength);
    this.setTicks(this.ticks);

    this.render();
  }
  //#endregion

  //#region settings
  setSpeed(ticksPerSec: number): void {
    const pausedState = this.paused;
    this.pause();

    this.ticksPerSec = Math.max(1, Math.floor(ticksPerSec));

    if (!pausedState) this.play();
  }

  setPalette(palette: Palette): void {
    this.options.palette = palette;
    this.renderer.setPalette(palette);
    this.render();
  }
  //#endregion

  //#region game loop
  private loop(): void {
    if (this.paused || this.died) return;

    const event = this.tick();
    if (event.type === "collision") {
      this.died = true;
      this.setDeath(this.died);
      this.loopId = null;
      return;
    }

    if (event.type === "fruit-eaten") {
      this.board.addFruit();
    }
    this.setLength(this.board.snakeLength);

    this.loopId = setTimeout(() => this.loop(), 1000 / this.ticksPerSec);
  }

  private tick(): BoardEvent {
    const event: BoardEvent = this.board.update();
    this.ticks++;
    this.setTicks(this.ticks);
    this.render();

    return event;
  }

  private render(): void {
    this.renderer.drawGrid(this.board.grid);
  }
  //#endregion

  //#region inputs
  private setupControls(): void {
    this.unsubscribers.push(
      ...this.bindGameControls(),
      ...this.bindPlayer1Movement(),
    );
  }

  private bindGameControls(): (() => void)[] {
    const c = this.controls;
    return [
      ...gameControlBindings.map(([key, action]) => c.bind(key, action)),

      c.subscribe("pause", () => this.pause()),
      c.subscribe("play", () => (this.died ? this.reset() : this.play())),
      c.subscribe("toggle", () => this.togglePause()),
      c.subscribe("reset", () => (this.paused || this.died) && this.reset()),
    ];
  }

  private bindPlayer1Movement(): (() => void)[] {
    return this.bindMovement(player1Movement);
  }

  private bindMovement({ keys, actions }: MovementBindings): (() => void)[] {
    const unsubscribers: (() => void)[] = [];

    for (const dir of MOVEMENT_DIRECTIONS) {
      for (const key of keys[dir]) {
        unsubscribers.push(this.controls.bind(key, actions[dir]));
      }

      unsubscribers.push(
        this.controls.subscribe(actions[dir], () =>
          this.board.setSnakeDirection(Directions[dir]),
        ),
      );
    }

    return unsubscribers;
  }
  //#endregion
}
