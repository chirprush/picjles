class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toPos(pos) {
		return new Vec2(Math.floor(this.x / pixl), Math.floor((this.y - toolbarHeight) / pixl));
	}

	inBounds() {
		return this.x >= 0 && this.x < cols && this.y >= 0 && this.y < rows;
	}
}

class ColorButton {
	constructor(color) {
		this.color = color;
	}

	render(pos, selected) {
		fillRect(ctx, pos, colorButtonLength, colorButtonLength, this.color);
		if (selected) {
			drawRect(ctx, pos, colorButtonLength, colorButtonLength, CURSOR_COLOR);
		}
	}
}

class Toolbar {
	constructor(colorButtons) {
		this.colorButtons = colorButtons;
		this.selected = 1;
		this.saveSelection = 1;
	}

	getColor(index) {
		return this.colorButtons[index - 1].color;
	}

	render(pos) {
		fillRect(ctx, pos, width, toolbarHeight, TOOLBAR_COLOR);
		this.colorButtons.forEach((button, index) => 
			button.render(
				new Vec2(pos.x + colorButtonPaddingX * (index + 1), pos.y + colorButtonPaddingY),
				this.selected === index + 1));
	}

	update(pos) {
		this.colorButtons.forEach((button, index) => {
			let buttonPos = new Vec2(pos.x + colorButtonPaddingX * (index + 1), pos.y + colorButtonPaddingY);
			if (mouseDown &&
				mousePos.x >= buttonPos.x &&
				mousePos.x < buttonPos.x + colorButtonLength &&
				mousePos.y >= buttonPos.y &&
				mousePos.y < buttonPos.y + colorButtonLength) {
				this.selected = index + 1;
			}
		})
	}
}

let canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const width = canvas.width;
const height = canvas.height;

const toolbarHeight = isMobile ? 100 : 20;
const colorButtonLength = toolbarHeight / 2;
const colorButtonPaddingX = isMobile ? 100 : 20;
const colorButtonPaddingY = (toolbarHeight - colorButtonLength) / 2;

const pixl = isMobile ? 50 : 20;
const cols = Math.floor(width / pixl);
const rows = Math.floor(height / pixl);

let pixels = Array(rows).fill(0).map(_ => Array(cols).fill(0));

let mousePos = new Vec2(0, 0);
let mouseDown = false;

const toolbar = new Toolbar([new ColorButton("#efdfdf"), new ColorButton("#fe8019")]);

const BACKGROUND_COLOR = "#1d2021";
const TOOLBAR_COLOR = "#181b1c";
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
	if (!coord.inBounds()) {
		return -1;
	}
	return pixels[coord.y][coord.x];
};

const frame = () => {
	requestAnimationFrame(frame);
	clear(ctx, BACKGROUND_COLOR);
	toolbar.render(new Vec2(0, 0));
	toolbar.update(new Vec2(0, 0));
	let coord = mousePos.toPos();
	pixels.forEach((row, y) => {
		row.forEach((_, x) => {
			if (mouseDown && x === coord.x && y === coord.y) pixels[y][x] = toolbar.selected;
			if (pixels[y][x] > 0) fillRect(ctx, new Vec2(x * pixl, y * pixl + toolbarHeight), pixl, pixl, toolbar.getColor(pixels[y][x]));
		})
	});
	if (coord.inBounds()) {
		drawRect(ctx, new Vec2(coord.x * pixl, coord.y * pixl + toolbarHeight), pixl, pixl, CURSOR_COLOR);
	}
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
	if (isMobile && toolbar.selected === getAtPos(mousePos)) {
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
