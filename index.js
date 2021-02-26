let canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const pixl = 20;
const cols = Math.floor(width / pixl);
const rows = Math.floor(height / pixl);

let pixels = Array(rows).fill(0).map(_ => Array(cols).fill(0));

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let drawColor = false;

const BACKGROUND_COLOR = "#1d2021";
const CELL_COLOR = "#efdfdf";

const clear = (ctx, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
}

const drawRect = (ctx, x, y, w, h, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

const getAtPos = (x, y) => pixels[Math.floor(y / pixl)][Math.floor(x / pixl)];

const frame = () => {
	requestAnimationFrame(frame);
	clear(ctx, BACKGROUND_COLOR);
	pixels.forEach((row, y) => {
		row.forEach((pixel, x) => {
			if (mouseDown && x === Math.floor(mouseX / pixl) && y === Math.floor(mouseY / pixl)) pixels[y][x] = drawColor;
			if (pixel) drawRect(ctx, x * pixl, y * pixl, pixl, pixl, CELL_COLOR);
		})
	});
}

(() => {
	frame();
})()

document.addEventListener("keypress", event => {
	switch (event.key) {
		case "c":
			pixels.forEach((row, y) => {
				row.forEach((_, x) => {
					pixels[y][x] = 0;
				})
			})
			break;
	}
})

document.addEventListener("mousedown", event => {
	mouseDown = true;
	drawColor = !getAtPos(mouseX, mouseY)
})

document.addEventListener("mouseup", event => {
	mouseDown = false;
})

document.addEventListener("mousemove", event => {
	mouseX = event.offsetX;
	mouseY = event.offsetY;
})
