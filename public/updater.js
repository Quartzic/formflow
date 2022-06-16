/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

autoUpdater.autoDownload = false

autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Updates available',
        message: `A new version of Flowform (${info.version}), released ${info.releaseDate}, is available. `,
        buttons: ['Update', 'Cancel']
    }).then((buttonIndex) => {
        if (buttonIndex === 0) {
            autoUpdater.downloadUpdate()
        }
        else {

        }
    })
})


autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: 'Install updates',
        message: 'Updates downloaded. Flowform will quit to update.'
    }).then(() => {
        setImmediate(() => autoUpdater.quitAndInstall())
    })
})

// export this to MenuItem click callback
function checkForUpdates () {
    autoUpdater.checkForUpdates()
}

module.exports.checkForUpdates = checkForUpdates