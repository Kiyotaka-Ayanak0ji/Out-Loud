"""Lossless RGB LSB frame matching the supplied reference: length, XOR text, CRC-32."""
from pathlib import Path
import struct
import zlib
from PIL import Image

OUT = Path(__file__).resolve().parents[1] / "frontend/public/clues/master-plate.png"
MESSAGE = "Upload needed."
KEY = b"out"

def encode(image, message, key):
    data = message.encode("utf-8")
    payload = bytes(b ^ key[i % len(key)] for i, b in enumerate(data))
    frame = struct.pack(">I", len(payload)) + payload + struct.pack(">I", zlib.crc32(data))
    image = image.convert("RGB")
    flat = bytearray(image.tobytes())
    if len(frame) * 8 > len(flat):
        raise ValueError("Image too small")
    for i, byte in enumerate(frame):
        for k in range(8):
            index = i * 8 + k
            flat[index] = (flat[index] & 0xFE) | ((byte >> (7 - k)) & 1)
    return Image.frombytes("RGB", image.size, bytes(flat))

if __name__ == "__main__":
    with Image.open(OUT) as image:
        result = encode(image, MESSAGE, KEY)
    result.save(OUT, "PNG")