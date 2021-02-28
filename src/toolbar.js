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

	touching(ctx, pos, offset) {
		return pos.x >= offset.x &&
			pos.x < ctx.width &&
			pos.y >= offset.y &&
			pos.y < ctx.height;
	}

	render(ctx, pos) {
		ctx.fillRect(pos, ctx.width, Toolbar.height, TOOLBAR_COLOR);
		this.colorButtons.forEach((button, index) => 
			button.render(
				ctx,
				new Vec2(pos.x + ColorButton.paddingX * (index + 1), pos.y + ColorButton.paddingY),
				this.selected === index + 1));
	}

	mouseDown(ctx, button, pos, pixels) {
		this.colorButtons.forEach((_, index) => {
			let buttonPos = new Vec2(ColorButton.paddingX * (index + 1), ColorButton.paddingY);
			if (pos.x >= buttonPos.x &&
				pos.x < buttonPos.x + ColorButton.length &&
				pos.y >= buttonPos.y &&
				pos.y < buttonPos.y + ColorButton.length) {
				if (button === 0) {
					this.selected = index + 1;
				} else if (button === 2) {
					pixels.clear(index + 1);
				}
			}
		});
	}
}

const TOOLBAR_COLOR = "#181b1c";
const SELECTED_COLOR = "#61afef";

export { ColorButton, Toolbar, TOOLBAR_COLOR, SELECTED_COLOR };
