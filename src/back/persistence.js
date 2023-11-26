const { app } = require('electron');
const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('node:path');

function getDataPath() {
    const environmentPath = app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath();
    return path.join(environmentPath, 'data');
}

function pathToPosix(pathStr) {
    return pathStr.split(path.sep).join(path.posix.sep);
}

async function readJson(filePath) {
    const jsonString = await fsPromises.readFile(filePath, 'utf-8');
    return JSON.parse(jsonString);
}

async function getApplications() {
    const applicationsPath = path.join(getDataPath(), 'applications.json');
    const applications = await readJson(applicationsPath);
    Object.entries(applications).forEach(([appKey, application]) => {
        application.icon = getIconPath(appKey);
    });
    return applications;
}

async function readFile(filePath) {
    return await fsPromises.readFile(filePath, 'utf-8');
}

function getIconPath(iconName) {
    for (const ext of ['png', 'svg', 'svg']) {
        const iconPath = path.join(getDataPath(), 'assets', 'icons', `${iconName}.${ext}`);
        if (fs.existsSync(iconPath)) {
            return iconPath;
        }
    }
    return '../assets/exe-default-icon.png';
}

function getBackgroundPath() {
    const bgPath = path.join(getDataPath(), 'assets', 'backgrounds', 'splash.jpg');
    return pathToPosix(bgPath);
}

module.exports = {
    getApplications,
    getDataPath,
    readFile,
    getBackgroundPath
};