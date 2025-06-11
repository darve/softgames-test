import { Application, Assets, Container, Sprite } from "pixi.js";
import { quick_sprite } from "../lib/utils";
import { Transition } from "../lib/transition";
import { tokens } from "../tokens";

interface Scene {
    render: () => void;
    update: (delta: number) => void;
}

export const ace_of_shadows = async (container: Container): Promise<Scene> => {

    const app = new Application();
    await app.init({
        canvas: document.querySelector('#pixi-canvas') as HTMLCanvasElement,
        background: "#34495e",
        resizeTo: window,

        autoStart: false,
        sharedTicker: false
    });

    const transitions: Transition[] = [];
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
            if (window.innerWidth < tokens.breakpoints.narrow) {
                sprite.width = 60;
                sprite.height = 90;
            } else {
                sprite.width = 200;
                sprite.height = 300;
            }
            sprite.x = w2 / 2 + (index)
            sprite.y = h2;
            card_sprites.push(sprite);
            app.stage.addChild(sprite);
            transitions.push(new Transition({
                delay: Math.abs(index - 144) * 60,
                duration: 120,
                start: w2 / 2 + (index),
                finish: w2 + w2 / 2 + Math.abs(index - 144),
                step: (value: number) => {
                    sprite.x = value;
                },
                cb: () => {
                    leftContainer.removeChild(sprite);
                    rightContainer.addChild(sprite);
                }
            }));

        });
    });

    const update = (delta: number) => {
        console.log('updating');
        transitions.map((t, i) => {
            t.tick();
            if (t.dead) transitions.splice(i, 1);
        });
    };

    const render = () => {
        console.log('rendering');
        app.render();
    }

    return { render, update };

};