const cp = require('child_process');

function runExecutable(exePath) {
    const child = cp.spawn(exePath, {
        detached: true,
        stdio: 'ignore'
    });
    child.unref();
}

module.exports = {
    runExecutable
};