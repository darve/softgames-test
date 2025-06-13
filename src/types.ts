import { Container } from "pixi.js";

export interface Scene {
  container: Container;
  update: (delta: number) => void;
  reset: () => void;
}
