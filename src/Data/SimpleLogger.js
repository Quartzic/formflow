import {db} from "./db.js";

export function writeMessage(message, data, level) {
  if (data) {
    db.logEvents.add({
      timestamp: new Date(),
      level: level || "log",
      message: message,
      data: data,
    });
  } else {
    db.logEvents.add({
      timestamp: new Date(),
      level: level || "log",
      message: message,
    });
  }

  switch (level) {
    case "info":
      if (data) {
        console.info(message, data);
      } else console.info(message);
      break;
    case "warn":
      if (data) {
        console.warn(message, data);
      } else console.warn(message);
      break;
    case "error":
      if (data) {
        console.error(message, data);
      } else console.error(message);
      break;
    default:
      if (data) {
        console.log(message, data);
      } else console.log(message);
      break;
  }
}
export function debug(message, data) {
  writeMessage(message, data, "debug");
}
export function info(message, data) {
  writeMessage(message, data, "info");
}
export function warn(message, data) {
  writeMessage(message, data, "warn");
}
export function error(message, data) {
  writeMessage(message, data, "error");
}
