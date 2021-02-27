const clear = (ctx, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

const drawRect = (ctx, pos, w, h, color) => {
	ctx.strokeStyle = color;
	ctx.strokeRect(pos.x, pos.y, w, h);
}

const fillRect = (ctx, pos, w, h, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(pos.x, pos.y, w, h);
}

export { clear, drawRect, fillRect };
