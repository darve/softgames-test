import { Application, Assets, Container, Sprite } from "pixi.js";
import { quick_sprite } from "../lib/utils";

export const magic_words = async () => {

    const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
    const data = await response.json();
    console.log(data);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const w2 = w / 2;
    const h2 = h / 2;

    data.avatars.map((v: any, i: number) => {
        const avatar = new Sprite(Assets.get(v.url));
        app.stage.addChild(avatar);
        console.log(avatar);
    });

    return {
        render: () => {
            app.render();
        },
        update: (delta: number) => {
            // Update logic if needed
        }
    };


};

interface CharacterProps {
    name: string;
    avatar: Sprite;
}

class Character {
    name: string;
    avatar: Sprite;

    constructor({ name, avatar }: CharacterProps) {
        this.name = name;
        this.avatar = avatar;
    }

    render(container: Container) {
        container.addChild(this.avatar);
        this.avatar.x = 100; // Example position
        this.avatar.y = 100; // Example position
    }
}
