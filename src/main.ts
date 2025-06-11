
import { Application, Container, Ticker } from "pixi.js";
import { ace_of_shadows } from "./scenes/ace-of-shadows";
import { magic_words } from "./scenes/magic-words";
import { phoenix_flame } from "./scenes/phoenix-flame";

(async () => {

  const app = new Application();
  await app.init({
    canvas: document.querySelector('#pixi-canvas') as HTMLCanvasElement,
    background: "#34495e",
    resizeTo: window
  });

  const containers = {
    ui: new Container(),
    ace_of_shadows: new Container(),
    magic_words: new Container(),
    phoenix_flame: new Container(),
  };

  const scenes = {
    ace_of_shadows: await ace_of_shadows(scene_containers.ace_of_shadows),
    magic_words: await magic_words(scene_containers.magic_words),
    phoenix_flame: await phoenix_flame(scene_containers.phoenix_flame),
  } as const;

  const active_scene: string | null = null;

  const ticker = new Ticker();


  ticker.add((ticker) => {

    if (active_scene) {

    }


    // active_scene.update(ticker.deltaTime);
    // active_scene.render();
  });

  const init = async () => {

    app.stage.addChild(containers.ace_of_shadows);
    app.stage.addChild(containers.magic_words);
    app.stage.addChild(containers.phoenix_flame);
    app.stage.addChild(containers.ui);

    ticker.start();
  };

})();
