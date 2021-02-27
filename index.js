class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toPos(pos) {
		return new Vec2(Math.floor(this.x / pixl), Math.floor(this.y / pixl));
	}
}

let canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const width = canvas.width;
const height = canvas.height;

const pixl = isMobile ? 50 : 20;
const cols = Math.floor(width / pixl);
const rows = Math.floor(height / pixl);

let pixels = Array(rows).fill(0).map(_ => Array(cols).fill(0));

let mousePos = new Vec2(0, 0);
let mouseDown = false;
let drawColor = false;

const BACKGROUND_COLOR = "#1d2021";
const CELL_COLOR = "#efdfdf";
const CURSOR_COLOR = "#61afef";

const clear = (ctx, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
}

const drawRect = (ctx, pos, w, h, color) => {
	ctx.strokeStyle = color;
	ctx.strokeRect(pos.x, pos.y, w, h);
}

const fillRect = (ctx, pos, w, h, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(pos.x, pos.y, w, h);
}


const getAtPos = pos => {
	let coord = pos.toPos();
	return pixels[coord.y][coord.x];
};

const frame = () => {
	requestAnimationFrame(frame);
	clear(ctx, BACKGROUND_COLOR);
	let coord = mousePos.toPos();
	pixels.forEach((row, y) => {
		row.forEach((_, x) => {
			if (mouseDown && x === coord.x && y === coord.y) pixels[y][x] = drawColor;
			if (pixels[y][x]) fillRect(ctx, new Vec2(x * pixl, y * pixl), pixl, pixl, CELL_COLOR);
		})
	});
	drawRect(ctx, new Vec2(coord.x * pixl, coord.y * pixl), pixl, pixl, CURSOR_COLOR);
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

document.addEventListener("pointerdown", event => {
	mouseDown = true;
	mousePos.x = event.offsetX;
	mousePos.y = event.offsetY;
	drawColor = !getAtPos(mousePos)
})

document.addEventListener("pointerup", event => {
	mouseDown = false;
})

document.addEventListener("pointermove", event => {
	mousePos.x = event.offsetX;
	mousePos.y = event.offsetY;
})
