const DB = "outloud-owner-local";
const open = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB, 1);
  req.onupgradeneeded = () => req.result.createObjectStore("drafts");
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});
export const loadLocalDraft = async () => {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readonly");
    const req = tx.objectStore("drafts").get("owner");
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
};
export const saveLocalDraft = async (draft) => {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    tx.objectStore("drafts").put(draft, "owner");
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onabort = tx.onerror = () => { db.close(); reject(tx.error); };
  });
};