
import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import { draw_rounded_rect } from './rounded-rect.js';

// Canvas dimensions
const WIDTH = 400;
const HEIGHT = 600;
const W2 = WIDTH / 2;
let colour_index = 0;

const colours = [

    '#c0392b',
    '#d35400',
    '#f39c12',
    '#27ae60',
    '#2980b9',
    '#8e44ad',


    // '#95A6A6',
    // '#ECF0F1'
    // // '#16a085',
    // // '#2980b9',
    // // '#8e44ad',
    // // '#2c3e50',
    // // '#d35400',
    // // '#c0392b',
    // // '#f39c12',
    // // '#7f8c8d'
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

    // ctx.fillStyle = colours[Math.floor(Math.random() * colours.length)];
    ctx.fillStyle = colours[colour_index];
    ctx.strokeStyle = '#2C3D50';
    ctx.lineWidth = 20;
    draw_rounded_rect(ctx, 10, 10, 380, 580, 30);
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';   // light shadow
    ctx.shadowBlur = 10;                      // how soft the shadow is
    ctx.shadowOffsetX = 5;                    // horizontal offset
    ctx.shadowOffsetY = 5;                    // vertical offset
    ctx.fill();
    ctx.restore();
    // draw_rounded_rect(ctx, 10, 10, 380, 580, 50);
    // draw_rounded_rect(ctx, 10, 10, 390, 590, 40);
    // ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = "100 50px Open Sans normal";
    const txt_card_heading = ctx.measureText('Card number:');
    ctx.fillText('Card number:', W2 - txt_card_heading.width / 2, 200);

    ctx.font = "700 180px Open Sans normal";
    const txt_card_number = ctx.measureText(card_num);
    ctx.fillText(card_num, W2 - txt_card_number.width / 2, 420);

    colour_index++;
    if (colour_index >= colours.length) {
        colour_index = 0;
    }
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