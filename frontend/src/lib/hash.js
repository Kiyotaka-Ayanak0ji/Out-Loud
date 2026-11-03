export const sha256 = async (text) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))).map((b) => b.toString(16).padStart(2, "0")).join("");
export const normalize = (text) => text.toLowerCase().replace(/[^a-z]/g, "");
export const matches = async (text, hash) => (await sha256(normalize(text))) === hash;
