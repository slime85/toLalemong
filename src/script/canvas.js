const $canvases = document.querySelectorAll("canvas");

const arc = (ctx, x, y, size, fill = false, stroke = false, alpha = 1, start = 0, end = pi * 2, ) => {
  ctx.arc(x + page.x, y + page.y, size, start, end);
  
  ctx.globalAlpha = alpha;

  if(fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if(stroke) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    stroke.cap = stroke.cap === undefined ? "round" : stroke.cap;
    ctx.lineCap = stroke.cap;
    ctx.lineJoin = stroke.cap;
    ctx.stroke();
  }
}

window.addEventListener("resize", e => {
  for(let i = 0; i < $canvases.length; i++) {
    const canvas = $canvases[i];
    canvas.width = page.w;
    canvas.height = page.h;
  }
})
