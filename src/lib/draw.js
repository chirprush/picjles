import { Vec2 } from "./vec.js";

class Context {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		const canvas = document.getElementById("canvas");
		canvas.width = width;
		canvas.height = height;
		this.ctx = canvas.getContext("2d");
		this.mouseButtons = new Set();
		this.mousePos = new Vec2(0, 0);
	}

	mouseDown(button) {
		this.mouseButtons.add(button);
	}

	mouseUp(button) {
		this.mouseButtons.delete(button);
	}

	mousePressed(button) {
		return this.mouseButtons.has(button);
	}

	mouseMove(pos) {
		this.mousePos = pos;
	}

	clear(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.width, this.height);
	}

	drawRect(pos, w, h, color) {
		this.ctx.strokeStyle = color;
		this.ctx.strokeRect(pos.x, pos.y, w, h);
	}

	fillRect(pos, w, h, color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(pos.x, pos.y, w, h);
	}
}

export { Context };
