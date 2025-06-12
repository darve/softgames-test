import { Container, Text, TextStyle, Sprite, Assets, Graphics } from 'pixi.js';

interface RichTextOptions {
    style?: TextStyle;
    maxWidth?: number;
    lineHeight?: number;
    imageHeight?: number;
}

export class RichText extends Container {
    content: string;
    images: { [key: string]: Sprite }; // e.g., { smile: 'smile.png', star: 'star.png' }
    style: TextStyle;
    maxWidth: number;
    lineHeight: number;
    imageHeight: number;

    constructor(content: string, images: { [key: string]: Sprite } = {}, options: RichTextOptions = {}) {
        super();
        this.content = content;
        this.images = images; // e.g., { smile: 'smile.png', star: 'star.png' }
        this.style = options.style || new TextStyle({ fill: 0x000000, fontSize: 24 });
        this.maxWidth = options.maxWidth || 500;
        this.lineHeight = options.lineHeight || this.style.fontSize * 1.4;
        this.imageHeight = options.imageHeight || this.style.fontSize;

        this.renderContent();
    }

    parse() {
        const regex = /\{(.*?)\}/g;
        const tokens = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(this.content))) {
            if (match.index > lastIndex) {
                tokens.push({ type: 'text', value: this.content.slice(lastIndex, match.index) });
            }
            tokens.push({ type: 'image', value: match[1].trim() });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < this.content.length) {
            tokens.push({ type: 'text', value: this.content.slice(lastIndex) });
        }

        return tokens;
    }

    async renderContent() {
        const tokens = this.parse();
        let x = 0;
        let y = 0;

        for (const token of tokens) {
            if (token.type === 'text') {
                const words = token.value.split(/(\s+)/); // preserve whitespace
                for (const word of words) {
                    const textObj = new Text({ text: word, style: this.style });
                    if (x + textObj.width > this.maxWidth && word.trim() !== '') {
                        x = 0;
                        y += this.lineHeight;
                    }
                    textObj.x = x;
                    textObj.y = y;
                    this.addChild(textObj);
                    x += textObj.width;
                }
            } else if (token.type === 'image') {
                const key = token.value;
                const tex = this.images[key].texture;
                if (!tex) continue;

                // const texture = await Assets.load(src);
                const sprite = new Sprite(tex);
                sprite.height = this.imageHeight;
                sprite.scale.x = sprite.scale.y;

                if (x + sprite.width > this.maxWidth) {
                    x = 0;
                    y += this.lineHeight;
                }
                sprite.x = x;
                sprite.y = y + (this.lineHeight - sprite.height) / 2;
                this.addChild(sprite);
                x += sprite.width;
            }
        }

        let gfx = new Graphics();
        gfx
            .roundRect(-20, -20, this.maxWidth + 40, this.getLocalBounds().maxY + 40, 10)
            .fill({ color: 0xFFFFFF }) // Fill with red

        this.addChildAt(gfx, 0);

    }
}
