"""Build the three Secret Layer plates: grayscale textures with one letter
embedded as a subtle brightness signature (+~22 luminance, blurred edges).
A levels/threshold tool in the browser recovers each letter. Nothing is faked:
the letters genuinely exist in the pixel data of the served JPEGs."""
import os
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SOURCES = {
    "plate-01": (
        "O",
        "https://static.prod-images.emergentagent.com/jobs/c9233ddb-b9cd-4f4d-be86-f71c7372af1e/images/19fb4c22e129181ee6aec5da30eb9d14f638274bf0c160290d41b15a85a68964.jpeg",
    ),
    "plate-02": (
        "U",
        "https://static.prod-images.emergentagent.com/jobs/c9233ddb-b9cd-4f4d-be86-f71c7372af1e/images/233b7a90fa9219c304f991edd378ad13739639f6d9f6f701f2deae2a22f22773.jpeg",
    ),
    "plate-03": (
        "T",
        "https://static.prod-images.emergentagent.com/jobs/c9233ddb-b9cd-4f4d-be86-f71c7372af1e/images/07af88a8ebfd2e96e01cdeb4de3e85a4e7d965a10d9030af68a457ab654382bd.jpeg",
    ),
}
OUT = "/app/frontend/public/clues"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SIZE = 900
DELTA = 30.0
CONTRAST = 0.35  # compress texture contrast so the levels tool separates the ghost cleanly


def fetch(url, path):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=40) as r, open(path, "wb") as f:
            f.write(r.read())
        return True
    except Exception as e:
        print("fetch failed:", url, e)
        return False


def letter_mask(letter, size):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    if os.path.exists(FONT):
        f = ImageFont.truetype(FONT, int(size * 0.62))
        d.text((size / 2, size / 2), letter, font=f, anchor="mm", fill=255)
    else:
        w = int(size * 0.11)
        if letter == "O":
            d.ellipse([size * 0.2, size * 0.2, size * 0.8, size * 0.8], outline=255, width=w)
        elif letter == "U":
            d.arc([size * 0.22, size * 0.3, size * 0.78, size * 0.85], 0, 180, fill=255, width=w)
            d.line([size * 0.22, size * 0.25, size * 0.22, size * 0.6], fill=255, width=w)
            d.line([size * 0.78, size * 0.25, size * 0.78, size * 0.6], fill=255, width=w)
        elif letter == "T":
            d.line([size * 0.15, size * 0.25, size * 0.85, size * 0.25], fill=255, width=w)
            d.line([size * 0.5, size * 0.25, size * 0.5, size * 0.8], fill=255, width=w)
    return mask.filter(ImageFilter.GaussianBlur(5))


def verify(path, letter):
    a = np.asarray(Image.open(path).convert("L")).astype(np.float32)
    m = np.asarray(letter_mask(letter, SIZE).resize((SIZE, SIZE))).astype(np.float32) / 255.0
    core = m > 0.85
    bg = m < 0.05
    print(f"{path}: letter-lum={a[core].mean():.1f} bg-lum={a[bg].mean():.1f} delta={a[core].mean()-a[bg].mean():.1f}")


os.makedirs(OUT, exist_ok=True)
for name, (letter, url) in SOURCES.items():
    raw = f"/tmp/{name}-raw.jpg"
    ok = fetch(url, raw)
    if ok:
        try:
            img = Image.open(raw).convert("L")
        except Exception:
            ok = False
    if not ok:
        raise SystemExit(f"base texture for {name} unavailable")
    img = img.resize((SIZE, SIZE))
    a = np.asarray(img).astype(np.float32)
    # flatten contrast around the mean, then embed the letter on top
    mean = a.mean()
    a = np.clip(mean + (a - mean) * CONTRAST, 0, 255)
    m = np.asarray(letter_mask(letter, SIZE)).astype(np.float32) / 255.0
    out = np.clip(a + DELTA * m, 0, 255).astype("uint8")
    dest = f"{OUT}/{name}.jpg"
    Image.fromarray(out).convert("L").save(dest, quality=92)
    verify(dest, letter)
print("plates written to", OUT)
