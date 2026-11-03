"""Secret Layer plates: full-contrast textures with letters written only into the
lowest bit of one colour channel (lossless PNG). Brightness/levels cannot reveal them."""
import os
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC = "https://static.prod-images.emergentagent.com/jobs/c9233ddb-b9cd-4f4d-be86-f71c7372af1e/images/"
PLATES = {
    "plate-01": ("FIND", 2, SRC + "19fb4c22e129181ee6aec5da30eb9d14f638274bf0c160290d41b15a85a68964.jpeg"),
    "plate-02": ("THE", 0, SRC + "233b7a90fa9219c304f991edd378ad13739639f6d9f6f701f2deae2a22f22773.jpeg"),
    "plate-03": ("WHISPER", 1, SRC + "07af88a8ebfd2e96e01cdeb4de3e85a4e7d965a10d9030af68a457ab654382bd.jpeg"),
}
OUT = "/app/frontend/public/clues"
FONT = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
SIZE = 720


def mask(text):
    m = Image.new("L", (SIZE, SIZE), 0)
    d = ImageDraw.Draw(m)
    f = ImageFont.truetype(FONT, int(SIZE * {3: 0.3, 4: 0.24}.get(len(text), 0.15)))
    d.text((SIZE / 2, SIZE / 2), text, font=f, anchor="mm", fill=255)
    return np.asarray(m) > 127


for name, (text, ch, url) in PLATES.items():
    raw = f"/tmp/{name}-raw.jpg"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=40) as r, open(raw, "wb") as fh:
        fh.write(r.read())
    a = np.asarray(Image.open(raw).convert("L").resize((SIZE, SIZE))).astype(np.uint8)
    rgb = np.stack([a, a, a], axis=-1).copy()
    m = mask(text)
    rgb[..., ch][m] |= 1
    rgb[..., ch][~m] = (rgb[..., ch][~m] & 0xFE) | np.random.randint(0, 2, (~m).sum(), dtype=np.uint8)
    dest = f"{OUT}/{name}.png"
    Image.fromarray(rgb, "RGB").save(dest, optimize=True)
    back = np.asarray(Image.open(dest))
    inside = (back[..., ch][m] & 1).mean()
    outside = (back[..., ch][~m] & 1).mean()
    lum_delta = np.abs(back.astype(int).mean(-1) - a.astype(int)).max()
    print(dest, os.path.getsize(dest), f"inside={inside:.2f} outside={outside:.2f} maxLumDelta={lum_delta:.2f}")
