const { app } = require('electron');
const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function getApplications() {
    const applicationsPath = path.join(getDataPath(), 'applications.json');
    const applications = await readJson(applicationsPath);
    Object.entries(applications).forEach(([appKey, application]) => {
        application.icon = getIconPath(appKey);
    });
    return applications;
}

async function readJson(filePath) {
    let data;
    try {
        data = await readFileText(filePath);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        await createEmptyJsonFile(filePath);
        data = await readFileText(filePath);
    }

    return JSON.parse(data);
}

async function readFileText(filePath) {
    return await fsPromises.readFile(filePath, 'utf-8');
}

async function createEmptyJsonFile(filePath) {
    await writeFileText(filePath, '{}');
}

async function writeFileText(filePath, text) {
    await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
    await fsPromises.writeFile(filePath, text, 'utf-8');
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

function pathToPosix(pathStr) {
    return pathStr.split(path.sep).join(path.posix.sep);
}

function getDataPath() {
    const environmentPath = app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath();
    return path.join(environmentPath, 'data');
}

module.exports = {
    getApplications,
    getDataPath,
    getBackgroundPath
};