import { Assets, Sprite, Texture } from "pixi.js";

export const quick_sprite = async (src: string): Promise<Sprite> => {
    const texture: Texture = await Assets.load(src);
    const newSprite: Sprite = new Sprite(texture);
    newSprite.anchor.set(0.5);
    return newSprite;
}