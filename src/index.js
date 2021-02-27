import { Vec2 } from "./lib/vec.js";
import { clear, fillRect, drawRect } from "./lib/draw.js";

const vecToPos = (v) => new Vec2(Math.floor(v.x / Pixels.pixl), Math.floor((v.y - Toolbar.height) / Pixels.pixl));

const vecInBounds = (v) => v.x >= 0 && v.x < pixels.cols && v.y >= 0 && v.y < pixels.rows;

class ColorButton {
	constructor(color) {
		this.color = color;
	}

	static get length() {
		return Toolbar.height / 2;
	}

	static get paddingX() {
		return isMobile ? 100 : 20;
	}

	static get paddingY() {
		return (Toolbar.height - ColorButton.length) / 2;
	}

	render(pos, selected) {
		fillRect(ctx, pos, ColorButton.length, ColorButton.length, this.color);
		if (selected) {
			drawRect(ctx, pos, ColorButton.length, ColorButton.length, CURSOR_COLOR);
		}
	}
}

class Toolbar {
	constructor(colorButtons) {
		this.colorButtons = colorButtons;
		this.selected = 1;
		this.saveSelection = 1;
	}

	static get height() {
		return isMobile ? 100 : 20;
	}

	getColor(index) {
		return this.colorButtons[index - 1].color;
	}

	render(pos) {
		fillRect(ctx, pos, width, Toolbar.height, TOOLBAR_COLOR);
		this.colorButtons.forEach((button, index) => 
			button.render(
				new Vec2(pos.x + ColorButton.paddingX * (index + 1), pos.y + ColorButton.paddingY),
				this.selected === index + 1));
	}

	update(pos) {
		this.colorButtons.forEach((button, index) => {
			let buttonPos = new Vec2(pos.x + ColorButton.paddingX * (index + 1), pos.y + ColorButton.paddingY);
			if (mouseDown &&
				mousePos.x >= buttonPos.x &&
				mousePos.x < buttonPos.x + ColorButton.length &&
				mousePos.y >= buttonPos.y &&
				mousePos.y < buttonPos.y + ColorButton.length) {
				this.selected = index + 1;
			}
		})
	}
}

class Pixels {
	constructor(cols, rows) {
		this.cols = cols;
		this.rows = rows;
		this.pixels = Array(rows).fill(0).map(_ => Array(cols).fill(0));
	}

	static get pixl() {
		return isMobile ? 50 : 20;
	}

	clear(value) {
		let v = value ? value : 0;
		this.pixels.forEach((row, y) => {
			row.forEach((_, x) => {
				this.pixels[y][x] = value;
			})
		});
	}

	getAt(pos) {
		let coord = vecToPos(pos);
		if (!vecInBounds(coord)) {
			return -1;
		}
		return this.pixels[coord.y][coord.x];
	}

	render(pos) {
		this.pixels.forEach((row, y) => {
			row.forEach((_, x) => {
				if (this.pixels[y][x] > 0) fillRect(ctx, new Vec2(x * Pixels.pixl + pos.x, y * Pixels.pixl + pos.y), Pixels.pixl, Pixels.pixl, toolbar.getColor(this.pixels[y][x]));
			})
		});
		let coord = vecToPos(mousePos);
		if (vecInBounds(coord)) drawRect(ctx, new Vec2(coord.x * Pixels.pixl, coord.y * Pixels.pixl + Toolbar.height), Pixels.pixl, Pixels.pixl, CURSOR_COLOR);
	}

	update(pos) {
		let coord = vecToPos(mousePos);
		if (mouseDown && vecInBounds(coord)) {
			this.pixels[coord.y][coord.x] = toolbar.selected;
		}
	}
}

let canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const width = canvas.width;
const height = canvas.height;

const cols = Math.floor(width / Pixels.pixl);
const rows = Math.floor(height / Pixels.pixl);

const pixels = new Pixels(cols, rows);

let mousePos = new Vec2(0, 0);
let mouseDown = false;

const toolbar = new Toolbar([
	new ColorButton("#efdfdf"), // White
	new ColorButton("#fb4944"), // Red
	new ColorButton("#fe8019"), // Orange
	new ColorButton("#fabd2f"), // Yellow
	new ColorButton("#94b413"), // Green
	new ColorButton("#331dab"), // Blue
	new ColorButton("#4e3670"), // Purple
]);

const BACKGROUND_COLOR = "#1d2021";
const TOOLBAR_COLOR = "#181b1c";
const CURSOR_COLOR = "#61afef";

const frame = () => {
	requestAnimationFrame(frame);
	clear(ctx, BACKGROUND_COLOR);
	toolbar.render(new Vec2(0, 0));
	toolbar.update(new Vec2(0, 0));
	pixels.render(new Vec2(0, Toolbar.height));
	pixels.update(new Vec2(0, Toolbar.height));
}

(() => {
	frame();
})()

document.addEventListener("keypress", event => {
	switch (event.key) {
		case "c":
			pixels.clear();
			break;
	}
})

document.addEventListener("pointerdown", event => {
	mouseDown = true;
	mousePos.x = event.offsetX;
	mousePos.y = event.offsetY;
	if (isMobile && toolbar.selected === pixels.getAt(mousePos) && toolbar.selected > 0) {
		toolbar.saveSelection = toolbar.selected ? toolbar.selected : toolbar.saveSelection;
		toolbar.selected = 0;
	} else if (!isMobile && event.button === 2) {
		toolbar.saveSelection = toolbar.selected ? toolbar.selected : toolbar.saveSelection;
		toolbar.selected = 0;
	} else if (toolbar.selected === 0) {
		toolbar.selected = toolbar.saveSelection;
	}
})

document.addEventListener("pointerup", event => {
	mouseDown = false;
})

document.addEventListener("pointermove", event => {
	mousePos.x = event.offsetX;
	mousePos.y = event.offsetY;
})

window.addEventListener("contextmenu", e => e.preventDefault());
