
import { Ticker } from "pixi.js";
import { ace_of_shadows } from "./scenes/ace-of-shadows";
import { magic_words } from "./scenes/magic-words";
import { phoenix_flame } from "./scenes/phoenix-flame";

(async () => {

  const scenes = {
    ace_of_shadows: await ace_of_shadows(),
    magic_words: await magic_words(),
    phoenix_flame: await phoenix_flame(),
  } as const; // This is handy as heck, bruv.

  const active_scene = scenes.ace_of_shadows;

  const ticker = new Ticker();
  ticker.start();

  ticker.add((ticker) => {
    active_scene.update(ticker.deltaTime);
    active_scene.render();
  });


})();
