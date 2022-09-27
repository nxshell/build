const { shell } = require("electron");
const shelljs = require("shelljs");

module.exports = async (context) => {
    console.log("context.outDir", context.outDir, context.appOutDir);
    if (process.platform == 'darwin') {
        const destDir = `${context.appOutDir}/NxShell.app/Contents/Resources/apps/powertools-shell`;
        shelljs.mkdir("-p", destDir);
        shelljs.cp("-rf", "../shell/dist/*", destDir);
        shelljs.cp("-rf", "../shell/devtools/webpack/dist/*", destDir);
        shelljs.cp("../shell/ptservices/package.json", destDir);
    } else {
        const destDir = `${context.appOutDir}/resources/apps/powertools-shell`;
        shelljs.mkdir("-p", destDir);
        shelljs.cp("-rf", "../shell/dist/*", destDir);
        shelljs.cp("-rf", "../shell/devtools/webpack/dist/*", destDir);
        shelljs.cp("../shell/ptservices/package.json", destDir);
    }
};
