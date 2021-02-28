import { Vec2 } from "./lib/vec.js";
import { Context } from "./lib/draw.js";
import { ColorButton, Toolbar, TOOLBAR_COLOR } from "./toolbar.js";
import { Pixels, BACKGROUND_COLOR, CURSOR_COLOR } from "./pixels.js"
import { isMobile } from "./util.js";

let mousePos = new Vec2(0, 0);
let mouseDown = false;

const width = window.innerWidth;
const height = window.innerHeight;

const ctx = new Context(width, height);

const cols = Math.floor(width / Pixels.pixl);
const rows = Math.floor(height / Pixels.pixl);

const pixels = new Pixels(cols, rows);

const toolbar = new Toolbar([
	new ColorButton("#efdfdf"), // White
	new ColorButton("#fb4944"), // Red
	new ColorButton("#fe8019"), // Orange
	new ColorButton("#fabd2f"), // Yellow
	new ColorButton("#94b413"), // Green
	new ColorButton("#331dab"), // Blue
	new ColorButton("#4e3670"), // Purple
]);

const frame = () => {
	requestAnimationFrame(frame);
	ctx.clear(BACKGROUND_COLOR);
	toolbar.render(ctx, new Vec2(0, 0));
	pixels.render(ctx, new Vec2(0, Toolbar.height), toolbar);
	pixels.update(ctx, new Vec2(0, Toolbar.height), toolbar);
}

(() => {
	frame();
})()

document.addEventListener("keypress", event => {
	switch (event.key) {
		case "c":
			pixels.clear();
			break;
		case "g":
			pixels.toggleGrid();
			break;
	}
})

document.addEventListener("pointerdown", event => {
	ctx.mouseDown(event.button);
	ctx.mouseMove(new Vec2(event.offsetX, event.offsetY));
	if (pixels.touching(ctx, ctx.mousePos, new Vec2(0, Toolbar.height))) {
		pixels.mouseDown(ctx, event.button, new Vec2(ctx.mousePos.x, ctx.mousePos.y - Toolbar.height), toolbar);
	} else if (toolbar.touching(ctx, ctx.mousePos, new Vec2(0, 0))) {
		toolbar.mouseDown(ctx, event.button, ctx.mousePos, pixels);
	}
})

document.addEventListener("pointerup", event => {
	ctx.mouseUp(event.button);
})

document.addEventListener("pointermove", event => {
	ctx.mouseMove(new Vec2(event.offsetX, event.offsetY));
})

window.addEventListener("contextmenu", e => e.preventDefault());
