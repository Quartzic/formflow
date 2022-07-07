const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    selectFolder: () => ipcRenderer.invoke('selectFolder'),
    saveFile: (filename, data) => ipcRenderer.invoke('saveFile', [filename, data]),
})