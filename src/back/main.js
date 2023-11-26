const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const {
    getDataPath,
    getApplications,
    getBackgroundPath,
} = require('./persistence');
const { runExecutable } = require('./runApp');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            height: 50,
            color: '#0000',
            symbolColor: 'white'
        },
        backgroundColor: '#9fA2B2',
        webPreferences: {
            preload: path.join(__dirname, '\\..\\front\\preload.js')
        }
    });

    win.loadFile('src/front/index.html');
};

app.whenReady().then(async () => {
    console.log('Data path:', getDataPath());

    const applications = await getApplications();

    ipcMain.handle('getApplications', () => applications);

    ipcMain.handle('runApplication', (event, appKey) => {
        const application = applications[appKey];
        if (!application?.executable) return false;
        
        if (app.isPackaged)
            runExecutable(application.executable);
        else
            console.log('Running application:', appKey);

        return true;
    });

    ipcMain.handle('getBackgroundPath', getBackgroundPath);

    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

