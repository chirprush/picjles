import { Vec2 } from "./lib/vec.js";
import { isMobile } from "./util.js";

class Pixels {
	constructor(cols, rows) {
		this.cols = cols;
		this.rows = rows;
		this.pixels = Array(rows).fill(0).map(_ => Array(cols).fill(0));
	}

	static get pixl() {
		return isMobile ? 50 : 20;
	}

	toCoord(pos, offset) {
		return new Vec2(Math.floor((pos.x - offset.x) / Pixels.pixl), Math.floor((pos.y - offset.y) / Pixels.pixl));
	}

	inBounds(pos) {
		return pos.x >= 0 && pos.x < this.cols && pos.y >= 0 && pos.y < this.rows;
	}

	clear(value) {
		let v = value ? value : 0;
		this.pixels.forEach((row, y) => {
			row.forEach((_, x) => {
				this.pixels[y][x] = value;
			})
		});
	}

	getAt(pos, offset) {
		let coord = this.toCoord(pos, offset);
		if (!this.inBounds(coord)) {
			return -1;
		}
		return this.pixels[coord.y][coord.x];
	}

	render(ctx, pos, toolbar) {
		this.pixels.forEach((row, y) => {
			row.forEach((_, x) => {
				if (this.pixels[y][x] > 0) ctx.fillRect(new Vec2(x * Pixels.pixl + pos.x, y * Pixels.pixl + pos.y), Pixels.pixl, Pixels.pixl, toolbar.getColor(this.pixels[y][x]));
			})
		});
		let coord = this.toCoord(ctx.mousePos, pos);
		if (this.inBounds(coord)) ctx.drawRect(new Vec2(coord.x * Pixels.pixl + pos.x, coord.y * Pixels.pixl + pos.y), Pixels.pixl, Pixels.pixl, CURSOR_COLOR);
	}

	update(ctx, pos, toolbar) {
		let coord = this.toCoord(ctx.mousePos, pos);
		if (ctx.mouseDown && this.inBounds(coord)) {
			this.pixels[coord.y][coord.x] = toolbar.selected;
		}
	}
}

const BACKGROUND_COLOR = "#1d2021";
const CURSOR_COLOR = "#61afef";

export { Pixels, BACKGROUND_COLOR, CURSOR_COLOR };
