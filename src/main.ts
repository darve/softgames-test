import { Application, Container, Ticker, Graphics } from "pixi.js";
import { ace_of_shadows } from "./scenes/ace-of-shadows";
import { magic_words } from "./scenes/magic-words";
import { phoenix_flame } from "./scenes/phoenix-flame";
import { Scene } from "./types";

(async () => {

  const app = new Application();
  await app.init({
    canvas: document.querySelector('#pixi-canvas') as HTMLCanvasElement,
    background: "#2980B9",
    resizeTo: window
  });

  const containers = {
    ui: new Container(),
    ace_of_shadows: new Container(),
    magic_words: new Container(),
    phoenix_flame: new Container(),
  };

  const scenes = {
    // ace_of_shadows: await ace_of_shadows(containers.ace_of_shadows),
    magic_words: await magic_words(containers.magic_words),
    phoenix_flame: await phoenix_flame(containers.phoenix_flame),
  } as const;

  const active_scene: Scene | null = scenes.phoenix_flame;
  const ticker = new Ticker();

  ticker.add((ticker) => {
    if (active_scene) {
      active_scene.update(ticker.deltaTime);
    }
  });

  const init = async () => {
    // app.stage.addChild(containers.ace_of_shadows);
    app.stage.addChild(containers.magic_words);
    app.stage.addChild(containers.phoenix_flame);
    app.stage.addChild(containers.ui);
    ticker.start();
  };

  init();

})();
