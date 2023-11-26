module.exports = {
    packagerConfig: {
        asar: true,
        icon: "./src/assets/icons/favicon"
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip'
        }
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
    ],
};
