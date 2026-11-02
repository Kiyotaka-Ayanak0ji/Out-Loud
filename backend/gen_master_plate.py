"""Build the master plate: a real PNG with a message hidden in the least
significant bit of every red pixel, XOR-scrambled with the passphrase 'out'
(the word the three plates spell). The in-browser decoder reverses exactly
this scheme: read LSBs -> 32-bit length header -> XOR payload -> UTF-8."""
import io
import urllib.request

import numpy as np
from PIL import Image

URL = "https://static.prod-images.emergentagent.com/jobs/c9233ddb-b9cd-4f4d-be86-f71c7372af1e/images/9226bc53d0d98c53f954938c3bd8ef57ee6c5ab1e2d29d868f642681b3565160.jpeg"
OUT = "/app/frontend/public/clues/master-plate.png"
KEY = b"out"
MESSAGE = (
    "OUT LOUD — bonus story placeholder. The real hidden story will be "
    "encoded here once it is supplied through Content Setup."
)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return Image.open(io.BytesIO(r.read()))


def to_bits(data):
    bits = []
    for b in data:
        for k in range(7, -1, -1):
            bits.append((b >> k) & 1)
    return bits


def encode(img, message, key):
    arr = np.array(img.convert("RGB"), dtype=np.uint8)
    h, w, _ = arr.shape
    if h * w < (4 + len(message)) * 8:
        raise ValueError("image too small")
    payload = bytes(c ^ key[i % len(key)] for i, c in enumerate(message.encode("utf-8")))
    header = len(payload).to_bytes(4, "big")
    flat = arr[:, :, 0].reshape(-1)
    for idx, bit in enumerate(to_bits(header + payload)):
        flat[idx] = (flat[idx] & 0xFE) | bit
    arr[:, :, 0] = flat.reshape(h, w)
    return Image.fromarray(arr)


def decode(img, key):
    arr = np.array(img.convert("RGB"), dtype=np.uint8)
    flat = arr[:, :, 0].reshape(-1)
    bits = (flat & 1).astype(np.uint8)
    n_bytes = len(bits) // 8
    byte_bits = bits[: n_bytes * 8].reshape(n_bytes, 8)
    bytes_out = np.packbits(byte_bits, axis=1).reshape(-1)
    ln = int.from_bytes(bytes(bytes_out[:4]), "big")
    payload = bytes(bytes_out[4 : 4 + ln])
    return bytes(c ^ key[i % len(key)] for i, c in enumerate(payload)).decode("utf-8")


base = fetch(URL).resize((1024, 1024))
stego = encode(base, MESSAGE, KEY)
stego.save(OUT, format="PNG")

round_trip = decode(Image.open(OUT), KEY)
assert round_trip == MESSAGE, "round-trip failed"
print("master plate ok — decoded round-trip:", round_trip)
