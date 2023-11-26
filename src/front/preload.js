const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('handle', {
    getApplications: () => ipcRenderer.invoke('getApplications'),
    runApplication: appKey => ipcRenderer.invoke('runApplication', appKey),
    getBackgroundPath: () => ipcRenderer.invoke('getBackgroundPath'),
    // getGsap: () => ipcRenderer.invoke('getGsap')
});