import { Application, Assets, Container, Sprite } from "pixi.js";
import { quick_sprite } from "../lib/utils";

export const ace_of_shadows = async () => {

    const app = new Application();
    await app.init({ canvas: document.querySelector('#pixi-canvas') as HTMLCanvasElement, background: "#1099bb", resizeTo: window });

    const w = window.innerWidth;
    const h = window.innerHeight;
    const w2 = w / 2;
    const h2 = h / 2;

    const leftContainer = new Container();
    const rightContainer = new Container();
    app.stage.addChild(leftContainer);
    app.stage.addChild(rightContainer);

    const card_promises = [];
    const card_sprites: Sprite[] = [];
    for (let i = 1; i < 145; i++) {
        card_promises.push(quick_sprite(`/ace-of-shadows/cards/card-${i}.png`));
    }

    Promise.all(card_promises).then((sprites) => {
        sprites.forEach((sprite, index) => {
            sprite.width = 100;
            sprite.height = 150;
            sprite.x = w2 / 2 + (index)
            sprite.y = h2;
            card_sprites.push(sprite);
            app.stage.addChild(sprite);
        });
    });

};