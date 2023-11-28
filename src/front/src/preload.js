const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('handle', {
    getApplications: () => ipcRenderer.invoke('getApplications'),
    runApplication: appKey => ipcRenderer.send('runApplication', appKey),
    quit: () => ipcRenderer.send('quit'),
    getBackgroundPath: () => ipcRenderer.invoke('getBackgroundPath')
});