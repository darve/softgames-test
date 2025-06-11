
import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import { draw_rounded_rect } from './rounded-rect.js';

// Canvas dimensions
const WIDTH = 400;
const HEIGHT = 600;
const W2 = WIDTH / 2;

const colours = [
    '#16a085',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#d35400',
    '#c0392b',
    '#f39c12',
    '#7f8c8d'
]

// Create a canvas and get its context
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

registerFont('./tools/opensans.ttf', {
    family: 'Open Sans'
});
// Example drawing function
function drawCard(ctx, card_num) {

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = colours[Math.floor(Math.random() * colours.length)];
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = "100 50px Open Sans normal";
    const txt_card_heading = ctx.measureText('Card number:');
    ctx.fillText('Card number:', W2 - txt_card_heading.width / 2, 200);

    ctx.font = "700 200px Open Sans normal";
    const txt_card_number = ctx.measureText(card_num);
    ctx.fillText(card_num, W2 - txt_card_number.width / 2, 420);
}

// Save canvas as PNG
function saveCanvasAsPNG(canvas, outputPath) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Image saved to ${outputPath}`);
}

// Main function
function generateCardSprites() {
    for (var i = 1; i < 145; i++) {
        drawCard(ctx, i);
        saveCanvasAsPNG(canvas, `./public/ace-of-shadows/cards/card-${i}.png`);
    }
}

generateCardSprites();