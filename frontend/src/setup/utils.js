export const get = (obj, path) =>
  path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

export const set = (obj, path, value) => {
  const keys = path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = clone;
  keys.forEach((k, i) => {
    const last = i === keys.length - 1;
    if (last) {
      cur[k] = value;
    } else {
      const next = cur[k];
      cur[k] = Array.isArray(next) ? [...next] : { ...(next || {}) };
      cur = cur[k];
    }
  });
  return clone;
};

export const DRAFT_KEY = "outloud-profile-draft-v1";

export const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

export const saveDraft = (draft) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {}
};

export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {}
};

export const downloadJson = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const statusOf = (value, evidenceOk) => {
  if (!value || !value.toString().trim()) return "missing";
  if (evidenceOk === undefined || evidenceOk === null) return "complete";
  return evidenceOk ? "verified" : "awaiting";
};
