const arc = (ctx, x, y, r, a0, a1, color, w) => { ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.stroke(); };

export async function drawShareCard(host) {
  await document.fonts?.ready;
  const c = document.createElement("canvas");
  c.width = 1200; c.height = 630;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0B1120"; ctx.fillRect(0, 0, 1200, 630);
  const g = ctx.createRadialGradient(1050, 80, 10, 1050, 80, 520);
  g.addColorStop(0, "rgba(249,115,22,0.35)"); g.addColorStop(1, "rgba(249,115,22,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1200, 630);
  ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 2; ctx.strokeRect(28, 28, 1144, 574);
  arc(ctx, 112, 120, 26, 0, Math.PI * 2, "#818CF8", 10);
  arc(ctx, 140, 120, 34, -0.75, 0.75, "#A78BFA", 10);
  arc(ctx, 140, 120, 56, -0.8, 0.8, "#F97316", 10);
  const font = (w, s) => `${w} ${s}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = "#F8FAFC"; ctx.font = font(700, 40); ctx.fillText("Out Loud", 220, 134);
  ctx.fillStyle = "#FDBA74"; ctx.font = font(600, 24); ctx.fillText("THE SECRET LAYER · SOLVED", 80, 270);
  ctx.fillStyle = "#F8FAFC"; ctx.font = font(700, 64); ctx.fillText("Found the Whisper.", 80, 360);
  ctx.fillText("Reached the Access Point.", 80, 440);
  ctx.fillStyle = "#94A3B8"; ctx.font = font(500, 26); ctx.fillText(`A portfolio by Ansik Aryan Samal  ·  ${host}`, 80, 540);
  return c.toDataURL("image/png");
}
