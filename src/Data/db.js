import Dexie from "dexie";
import { exportDB } from "dexie-export-import";

export const db = new Dexie("Papyrus");

db.version(1).stores({
  debugEvents: "++id, timestamp, message, data",
});

export function exportDBAsJSON() {
  exportDB(db).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `papyrus_debug_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
