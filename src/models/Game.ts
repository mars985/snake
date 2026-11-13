import { Board, type BoardEvent, type BoardOptions } from "./Board";
import { GridRenderer, type GridRendererOptions } from "./GridRenderer";
import { Directions } from "./Snake";
import type { Palette } from "../config/palettes.config";
import type { Controls } from "../input/Controls";

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

    this.setControls();

    this.board.addFruit();
    this.setSpeed(this.ticksPerSec);

    this.render();
  }

  setControls() {
    this.controls.bind("Escape", "pause");
    this.controls.bind("Enter", "play");
    this.controls.bind("Space", "toggle");
    this.controls.bind("KeyR", "reset");

    this.controls.bind("ButtonStart", "pause");
    this.controls.bind("ButtonA", "play");
    this.controls.bind("ButtonB", "toggle");
    this.controls.bind("ButtonSelect", "reset");

    this.controls.subscribe("pause", () => this.pause());
    this.controls.subscribe("play", () =>
      this.died ? this.reset() : this.play(),
    );
    this.controls.subscribe("toggle", () => this.togglePause());
    this.controls.subscribe(
      "reset",
      () => (this.paused || this.died) && this.reset(),
    );

    this.controls.bind("KeyW", "moveUp1");
    this.controls.bind("KeyA", "moveLeft1");
    this.controls.bind("KeyS", "moveDown1");
    this.controls.bind("KeyD", "moveRight1");

    this.controls.bind("ArrowUp", "moveUp1");
    this.controls.bind("ArrowLeft", "moveLeft1");
    this.controls.bind("ArrowDown", "moveDown1");
    this.controls.bind("ArrowRight", "moveRight1");

    this.controls.bind("DPadUp", "moveUp1");
    this.controls.bind("DPadLeft", "moveLeft1");
    this.controls.bind("DPadDown", "moveDown1");
    this.controls.bind("DPadRight", "moveRight1");

    this.controls.bind("LeftJoystickY-", "moveUp1");
    this.controls.bind("LeftJoystickX-", "moveLeft1");
    this.controls.bind("LeftJoystickY+", "moveDown1");
    this.controls.bind("LeftJoystickX+", "moveRight1");

    this.controls.bind("RightJoystickY-", "moveUp1");
    this.controls.bind("RightJoystickX-", "moveLeft1");
    this.controls.bind("RightJoystickY+", "moveDown1");
    this.controls.bind("RightJoystickX+", "moveRight1");

    this.controls.subscribe("moveUp1", () =>
      this.board.setSnakeDirection(Directions.up),
    );
    this.controls.subscribe("moveRight1", () =>
      this.board.setSnakeDirection(Directions.right),
    );
    this.controls.subscribe("moveDown1", () =>
      this.board.setSnakeDirection(Directions.down),
    );
    this.controls.subscribe("moveLeft1", () =>
      this.board.setSnakeDirection(Directions.left),
    );
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

  destroy(): void {
    this.pause();
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

  //#region gamepad

  //#endregion

  //#region inputs

  //#endregion
}
