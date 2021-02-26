let canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

let ctx = canvas.getContext("2d");

const BACKGROUND_COLOR = "#1d2021";
const CELL_COLOR = "#dfdfdf";

const clear = (ctx, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
}

const drawRect = (ctx, x, y, w, h, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

const frame = () => {
	requestAnimationFrame(frame);
	clear(ctx, BACKGROUND_COLOR);
}

(() => {
	frame();
})()
