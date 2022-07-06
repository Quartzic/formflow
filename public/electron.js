const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
} = require("electron-devtools-installer");
const extensionOptions = {
  loadExtensionOptions: { allowFileAccess: true },
};
// Module to control the application lifecycle and the native browser window.
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require("electron");
const path = require("path");
const url = require("url");
const { autoUpdater } = require("electron-updater")
const log = require("electron-log");
const version = require("../package.json").version;
const jetpack = require("fs-jetpack");

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
      installExtension(REDUX_DEVTOOLS, extensionOptions).then(() => {
        console.log("Redux DevTools installed");
      });
    } catch (err) {
      console.warn(
          "An error occurred while trying to add an extension:\n",
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
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
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

  ipcMain.handle('selectFolder', async () => {
    let result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if(result.canceled){
      return null;
    }
    if(result.filePaths.length === 0){
      return null;
    }
    return result.filePaths[0];
  });

  ipcMain.handle('saveFile', async(event, arg) => {
    // save given file to given path without user confirmation using fs

  });

  const log = require("electron-log")
  log.transports.file.level = "debug"
  autoUpdater.logger = log
  autoUpdater.checkForUpdatesAndNotify()
  installElectronDevToolExtensions();
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  app.quit();
});
