export function decodeSecret(rgba, passphrase) {
  let idx = 0;
  const readBytes = (n) => {
    const bytes = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < 8; k++) {
        const p = Math.floor(idx / 3) * 4 + idx % 3;
        bytes[i] = (bytes[i] << 1) | (rgba[p] & 1); idx++;
      }
    }
    return bytes;
  };
  const u32 = (b) => ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0;
  const length = u32(readBytes(4));
  if (!length || length > 100000 || (length + 8) * 8 > rgba.length / 4 * 3) throw new Error("invalid");
  const data = readBytes(length);
  const expected = u32(readBytes(4));
  const key = new TextEncoder().encode(passphrase);
  if (key.length) for (let i = 0; i < data.length; i++) data[i] ^= key[i % key.length];
  let crc = 0xFFFFFFFF;
  for (const b of data) {
    crc ^= b;
    for (let k = 0; k < 8; k++) crc = crc & 1 ? 0xEDB88320 ^ (crc >>> 1) : crc >>> 1;
  }
  if (((crc ^ 0xFFFFFFFF) >>> 0) !== expected) throw new Error("badkey");
  return new TextDecoder("utf-8", { fatal: true }).decode(data);
}