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
	toolbar.update(ctx, new Vec2(0, 0));
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
	}
})

document.addEventListener("pointerdown", event => {
	ctx.mouseDown = true;
	ctx.mousePos.x = event.offsetX;
	ctx.mousePos.y = event.offsetY;
	if (isMobile && toolbar.selected === pixels.getAt(ctx.mousePos, new Vec(0, Toolbar.height)) && toolbar.selected > 0) {
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
	ctx.mouseDown = false;
})

document.addEventListener("pointermove", event => {
	ctx.mousePos.x = event.offsetX;
	ctx.mousePos.y = event.offsetY;
})

window.addEventListener("contextmenu", e => e.preventDefault());
