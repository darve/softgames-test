import { Application, Assets, Container, Sprite } from "pixi.js";
import { quick_sprite } from "../lib/utils";

export const phoenix_flame = async () => {

    const app = new Application();
    await app.init({ canvas: document.querySelector('#pixi-canvas') as HTMLCanvasElement, background: "#1099bb", resizeTo: window });

    const w = window.innerWidth;
    const h = window.innerHeight;
    const w2 = w / 2;
    const h2 = h / 2;


};