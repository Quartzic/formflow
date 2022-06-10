import { db } from "./db";

export function debug(message, data = {}) {
  console.debug(`${message}`, data);
  db.debugEvents.add({
    timestamp: new Date(),
    message,
    data,
  });
}
