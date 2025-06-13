import { Container, Sprite, Texture } from "pixi.js";
import { get_scene_defaults, quick_sprite } from "../lib/utils";
import { Transition } from "../lib/transition";
import { Scene } from '../types';
import { events } from '../events';

export const ace_of_shadows = async (container: Container): Promise<Scene> => {

    const { width, height, w2, h2 } = get_scene_defaults(container);

    const transitions: Transition[] = [];
    const leftContainer = new Container();
    const rightContainer = new Container();
    const modifiers: [number, number, number][] = [];

    // We are using two containers. I believe the crux of this part of the test is the classic z-indexing nightmare. 
    // Removing from one container and popping into another is a simple way of resolving that, especially given 
    // the requirements here.
    container.addChild(rightContainer);
    container.addChild(leftContainer);

    const card_promises = [];
    const card_sprites: Sprite[] = [];

    for (let i = 1; i < 145; i++) {
        card_promises.push(quick_sprite(`/ace-of-shadows/cards/card-${i}.png`));
    }

    Promise.all(card_promises).then((sprites) => {
        sprites.forEach((sprite: Sprite) => {
            modifiers.push([
                Math.floor(Math.random() * 30) - 15, // x
                Math.floor(Math.random() * 60) - 30, // y
                (Math.random() * 0.2) - 0.1 // rotation
            ]);
            card_sprites.push(sprite);
        });
        events.emit('scene:assets_loaded');
        setup_cards();
    });

    const update = (delta: number) => {
        transitions.map((t, i) => {
            t.tick();
            if (t.dead) transitions.splice(i, 1);
        });
    };

    const setup_cards = () => {
        console.log('Setting up cards');
        transitions.splice(0, transitions.length); // empty the transitions array.
        card_sprites.forEach((sprite, index) => {
            rightContainer.removeChild(sprite); // Just in case.
            leftContainer.addChild(sprite);
            sprite.width = 200;
            sprite.height = 300;
            sprite.x = (w2 / 2 + index) + modifiers[index][0];
            sprite.y = (h2) + modifiers[index][1];
            sprite.rotation = modifiers[index][2];
            transitions.push(new Transition({
                delay: Math.abs(index - 144) * 60, // The inverse of i in the context of the loop length
                duration: 120,
                start: w2 / 2 + index,
                finish: w2 + w2 / 2 + Math.abs(index - 144),
                step: (value: number) => { sprite.x = value + modifiers[index][0] },
                cb: () => { // The ol' Switcheroo
                    leftContainer.removeChild(sprite);
                    rightContainer.addChild(sprite);
                }
            }));
        });
    }


    async function loadSpriteFromURL(url: string) {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        const texture = Texture.from(objectURL);
        const sprite = new Sprite(texture);

        sprite.x = 100;
        sprite.y = 100;

        container.addChild(sprite);
    }

    loadSpriteFromURL('https://api.dicebear.com/9.x/personas/png?body=squared&clothingColor=6dbb58&eyes=open&hair=buzzcut&hairColor=6c4545&mouth=smirk&nose=smallRound&skinColor=e5a07e');

    events.on('ace_of_shadows:show', () => {
        console.log('ace_of_shadows:show');
        container.visible = true;
    });

    events.on('ace_of_shadows:hide', () => {
        console.log('ace_ofs_shadows:hide');
        container.visible = false;
    });

    return {
        reset: setup_cards,
        container,
        update
    }

};