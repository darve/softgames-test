import { Assets, Container, Sprite, Texture } from "pixi.js";

export const quick_fetch_sprite = async (src: string): Promise<Sprite> => {
    const response = await fetch(src);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    const texture = Texture.from(imageBitmap);
    const newSprite = new Sprite(texture);
    newSprite.anchor.set(0.5);
    return newSprite;
}

export const quick_sprite = async (src: string): Promise<Sprite> => {
    const texture: Texture = await Assets.load(src);
    const newSprite: Sprite = new Sprite(texture);
    newSprite.anchor.set(0.5);
    return newSprite;
}

export const get_scene_defaults = (container: Container): {
    container: Container;
    width: number;
    height: number;
    w2: number;
    h2: number;
} => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const w2 = w / 2;
    const h2 = h / 2;
    container.alpha = 0;

    return {
        container,
        width: w,
        height: h,
        w2,
        h2
    };
}