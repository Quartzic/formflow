const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    selectFolder: () => ipcRenderer.invoke('selectFolder')
})