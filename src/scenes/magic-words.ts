import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Scene } from '../types';
import {
    get_scene_defaults,
    fetch_texture
} from "../lib/utils";
import { RichText } from "../lib/richtext";
import { Transition } from "../lib/transition";

interface RemoteAsset {
    obj: any;
    promise: Promise<Texture>;
}

interface Character {
    name: string;
    position: 'left' | 'right';
    texture: Texture;
}

interface Message {
}

export const magic_words = async (container: Container): Promise<Scene> => {

    console.log('Loading Magic Words Scene');
    const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
    const data = await response.json();
    const { width, height, w2, h2 } = get_scene_defaults(container);
    container.alpha = 1.0;

    const padding = 20;
    const message_width = 300;
    const message_left = w2 - (message_width / 2) - padding;
    const message_right = w2 + (message_width / 2) + padding;
    const avatarw = 128;
    const avatarh = 128;
    const avatar_w2 = avatarw / 2;
    const avatar_h2 = avatarh / 2;

    const text_props = {
        maxWidth: message_width,
        lineHeight: 30,
        imageHeight: 30
    };

    const messages: any = [];
    const emojis: Record<string, Texture> = {};
    const characters: Record<string, Character> = {};
    const character_textures: RemoteAsset[] = [];
    const emoji_textures: RemoteAsset[] = [];


    const transitions: Transition[] = [];
    const timeline: any = [];
    const message_delay = 1;
    let time_passed = 0;
    let timeline_running = false

    /**
     * Missing Avatar. Naughty.
     */
    character_textures.push({
        obj: {
            name: 'Neighbour',
            url: 'https://api.dicebear.com/9.x/bottts/png',
            position: 'left'
        },
        promise: fetch_texture('https://api.dicebear.com/9.x/bottts/png')
    });

    /**
     * And oh what is this, a missing emoji. NAUGHTY.
     */
    emoji_textures.push({
        obj: {
            name: 'affirmative',
            url: 'https://api.dicebear.com/9.x/fun-emoji/png?seed=Chase'
        },
        promise: fetch_texture('https://api.dicebear.com/9.x/fun-emoji/png?seed=Chase')
    });

    for (const avatar of data.avatars) {
        character_textures.push({
            obj: avatar,
            promise: fetch_texture(avatar.url)
        });
    }

    for (const emoji of data.emojies) {
        emoji_textures.push({
            obj: emoji,
            promise: fetch_texture(emoji.url)
        });
    }

    await Promise.all(character_textures.map(v => v.promise)).then((fetched_textures) => {
        character_textures.forEach((tex, index) => {
            console.log(tex.obj.position);
            characters[tex.obj.name] = {
                name: tex.obj.name,
                texture: fetched_textures[index],
                position: tex.obj.position
            };
        });
    });

    await Promise.all(emoji_textures.map(v => v.promise)).then((fetched_textures) => {
        emoji_textures.forEach((tex, index) => {
            emojis[tex.obj.name] = fetched_textures[index];
        });
    });

    let prevHeight = 60;
    let nextHeight = height - 60;

    data.dialogue.forEach((message: any, index: number) => {

        const rt = new RichText(message.text, emojis, text_props);
        const msg = {
            rt,
            character: message.character,
            height: rt.getLocalBounds().maxY + padding * 2
        };

        messages.push(msg);
        container.addChild(messages[index].rt);
        messages[index].rt.x = w2 - messages[index].rt.width / 2;
        messages[index].rt.y = prevHeight + 20;
        prevHeight += messages[index].rt.getLocalBounds().maxY + 40;

        const char_sprite = new Sprite(characters[message.name].texture);
        container.addChild(char_sprite);
        char_sprite.anchor.set(0.5);
        char_sprite.scale = 0.5;
        char_sprite.x = characters[message.name].position === 'left' ? message_left - avatar_w2 : message_right + 20;
        char_sprite.y = prevHeight - avatar_h2 + padding / 2;

        char_sprite.alpha = 0;
        msg.rt.alpha = 0;

        transitions.push(new Transition({
            delay: index * message_delay * 300,
            duration: 50,
            start: 0,
            finish: 1,
            step: (value: number) => {
                char_sprite.alpha = value;
                msg.rt.alpha = value;
            }
        }));

        transitions.push(new Transition({
            delay: index * message_delay * 300,
            duration: 100,
            start: Number(nextHeight),
            finish: Number(nextHeight - msg.height),
            step: (value: number) => {
                container.y = value;
            }
        }));

        nextHeight -= msg.height;
    });

    const update = (delta: number) => {
        // console.log('Updating Magic Words Scene');
        // time_passed += message_delay * delta;
        // if (time_passed < message_delay) return;
        // if (time_passed * message_delay) {
        //     time_passed = message_delay * delta;

        //     // if (timeline.length) {
        //     //     const [char_sprite, msg] = timeline.shift();
        //     // }
        // }

        transitions.map((t, i) => {
            t.tick();
            if (t.dead) transitions.splice(i, 1);
        });
    };

    return {
        container,
        update
    };

};
