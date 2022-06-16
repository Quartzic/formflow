const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require("electron-devtools-installer");
const extensionOptions = {
  loadExtensionOptions: { allowFileAccess: true },
};
// Module to control the application lifecycle and the native browser window.
const {
  app,
  BrowserWindow,
} = require("electron");
const path = require("path");
const url = require("url");
const {checkForUpdates} = require("./updater");
const version = require("../package.json").version;

app.setAboutPanelOptions({
  iconPath: path.join(__dirname, "..", "assets", "icon.png"),
  applicationName: "Formflow",
  applicationVersion: version,
  version: version,
});

function installElectronDevToolExtensions() {
  if (process.env.NODE_ENV !== "production") {
    try {
      installExtension(REACT_DEVELOPER_TOOLS, extensionOptions).then(() => {
        console.log("React DevTools installed");
      });
    } catch (err) {
      console.warn(
        "An error occurred while trying to add DevTools extension:\n",
        err
      );
    }
  }
}

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.

  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "..", "build", "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.maximize();
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installElectronDevToolExtensions();
  createWindow();
  checkForUpdates()
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  app.quit();
});
