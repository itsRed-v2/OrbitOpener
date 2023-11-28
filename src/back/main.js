const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const {
    getApplications,
    getBackgroundPath,
} = require('./persistence');
const { runExecutable } = require('./runApp');

app.whenReady().then(async () => {
    // Creating a placeholder window with a loading screen.
    const win = createWindow();   

    // Reading data on disk
    const applications = await getApplications();

    // Registering IPC channels handling
    ipcMain.handle('getApplications', () => applications);

    ipcMain.on('runApplication', (event, appKey) => {
        const application = applications[appKey];
        if (!application?.executable) return;
        
        if (app.isPackaged)
            runExecutable(application.executable);
        else
            console.log('Running application:', appKey);
    });

    ipcMain.on('quit', () => app.quit());

    ipcMain.handle('getBackgroundPath', getBackgroundPath);

    // Replacing the contents of the placeholder window with the actual application.
    win.loadFile('src/front/index.html');
});

app.on('window-all-closed', () => {
    app.quit();
});

function createWindow() {
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
            preload: path.join(__dirname, '\\..\\front\\src\\preload.js')
        }
    });

    win.loadFile('src/front/loading.html');
    return win;
}
