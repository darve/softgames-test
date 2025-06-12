import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Scene } from '../types';
import {
    get_scene_defaults,
    quick_sprite,
    quick_fetch_sprite
} from "../lib/utils";
import { RichText } from "../lib/richtext";

interface RemoteAsset {
    key: any;
    sprite: Promise<Sprite>;
}

const text_props = {
    maxWidth: 400,
    lineHeight: 30,
    imageHeight: 30
};

export const magic_words = async (container: Container): Promise<Scene> => {

    console.log('Loading Magic Words Scene');
    const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
    const data = await response.json();
    const { width, height, w2, h2 } = get_scene_defaults(container);
    container.alpha = 1.0;

    const messages: any = [];
    const emojis: any = {};
    const characters: any = {};
    const character_sprites: RemoteAsset[] = [];
    const emoji_sprites: RemoteAsset[] = [];

    character_sprites.push({
        key: {
            name: 'Neighbour',
            url: 'https://api.dicebear.com/9.x/bottts/png',
            position: 'left'
        },
        sprite: quick_fetch_sprite('https://api.dicebear.com/9.x/bottts/png')
    });

    emoji_sprites.push({
        key: {
            name: 'affirmative',
            url: 'https://api.dicebear.com/9.x/fun-emoji/png?seed=Chase'
        },
        sprite: quick_fetch_sprite('https://api.dicebear.com/9.x/fun-emoji/png?seed=Chase')
    });

    for (const avatar of data.avatars) {
        character_sprites.push({
            key: avatar, sprite: quick_fetch_sprite(avatar.url)
        });
    }

    for (const emoji of data.emojies) {
        emoji_sprites.push({
            key: emoji,
            sprite: quick_fetch_sprite(emoji.url)
        });
    }

    await Promise.all(character_sprites.map(v => v.sprite)).then((fetched_sprites) => {
        character_sprites.forEach((sprite, index) => {
            characters[sprite.key.name] = new Character({
                name: sprite.key.name,
                avatar: fetched_sprites[index],
                container,
                position: sprite.key.position
            });
        });
    });

    await Promise.all(emoji_sprites.map(v => v.sprite)).then((fetched_sprites) => {
        emoji_sprites.forEach((sprite, index) => {
            emojis[sprite.key.name] = fetched_sprites[index];
        });
    });

    console.log('Characters:', characters);
    console.log('Emojis:', emojis);
    console.log(data.dialogue[0].text);
    let prevHeight = 60;
    data.dialogue.forEach((message: any, index: number) => {
        messages.push({
            rt: new RichText(message.text, emojis, text_props),
            character: message.character,
        });

        container.addChild(messages[index].rt);
        messages[index].rt.x = w2 - messages[index].rt.width / 2;
        messages[index].rt.y = prevHeight + 20;

        prevHeight += messages[index].rt.getLocalBounds().maxY + 40;
    });

    // const rt = new RichText(data.dialogue[0].text, emojis, {
    //     maxWidth: 400,
    //     lineHeight: 30,
    //     imageHeight: 30
    // });


    characters.Sheldon.addToStage(w2 + 100, h2);
    characters.Leonard.addToStage(w2 - 100, h2);
    characters.Penny.addToStage(w2, h2);
    characters.Neighbour.addToStage(100, h2);

    const update = (delta: number) => {
    };

    return {
        update
    };

};

interface CharacterProps {
    name: string;
    avatar: Sprite;
    container: Container;
    position: string;
}

class Character {
    name: string;
    avatar: Sprite;
    container: Container;
    position: string;

    constructor({ name, avatar, container, position }: CharacterProps) {
        this.name = name;
        this.avatar = avatar;
        this.container = container;
        this.position = position;
    }

    addToStage(x: number, y: number) {
        this.container.addChild(this.avatar);
        this.avatar.x = x;
        this.avatar.y = y;
    }
}
