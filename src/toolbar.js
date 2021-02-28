import { Vec2 } from "./lib/vec.js";
import { isMobile } from "./util.js";

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

	render(ctx, pos, selected) {
		ctx.fillRect(pos, ColorButton.length, ColorButton.length, this.color);
		if (selected) {
			ctx.drawRect(pos, ColorButton.length, ColorButton.length, SELECTED_COLOR);
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

	render(ctx, pos) {
		ctx.fillRect(pos, ctx.width, Toolbar.height, TOOLBAR_COLOR);
		this.colorButtons.forEach((button, index) => 
			button.render(
				ctx,
				new Vec2(pos.x + ColorButton.paddingX * (index + 1), pos.y + ColorButton.paddingY),
				this.selected === index + 1));
	}

	update(ctx, pos) {
		this.colorButtons.forEach((button, index) => {
			let buttonPos = new Vec2(pos.x + ColorButton.paddingX * (index + 1), pos.y + ColorButton.paddingY);
			if (ctx.mouseDown &&
				ctx.mousePos.x >= buttonPos.x &&
				ctx.mousePos.x < buttonPos.x + ColorButton.length &&
				ctx.mousePos.y >= buttonPos.y &&
				ctx.mousePos.y < buttonPos.y + ColorButton.length) {
				this.selected = index + 1;
			}
		})
	}
}

const TOOLBAR_COLOR = "#181b1c";
const SELECTED_COLOR = "#61afef";

export { ColorButton, Toolbar, TOOLBAR_COLOR, SELECTED_COLOR };
