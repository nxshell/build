const shelljs = require("shelljs");
const fs = require('fs');

// download shell/core source code
shelljs.cd("../");
shelljs.exec("git clone https://github.com/nxshell/shell.git");
shelljs.exec("git clone https://github.com/nxshell/core.git");
shelljs.cd("./build");

const build_packages = require('./package-lock.json');
const electron_version = build_packages['dependencies']['electron']['version'];
function electron_rebuild(packages) {
  console.log('Electron version is ', electron_version);
  let p = packages.join(',')
  console.log('Will rebuild electron node packages ', p);
  shelljs.exec(`npm run rebuild -- -f -v ${electron_version} -w ${p}`)
}


function toFix(i, n) {
  i = "" + i;
  return i.padStart(n, 0);
}

// generate build time
const currentDate = new Date();
const currentY = currentDate.getUTCFullYear();
const currentM = currentDate.getUTCMonth() + 1;
const currentD = currentDate.getUTCDate();
const currentH = currentDate.getUTCHours();
const currentMi = currentDate.getUTCMinutes();
const buildTimes = toFix(currentY,4) + toFix(currentM,2) + toFix(currentD,2) + toFix(currentH,2) + toFix(currentMi,2);
fs.writeFileSync('electron-builder.env', `buildTimes=${buildTimes}`)

// generate build version
const packages = require('./package.json');
const version = packages.version;
const weblink = "http://106.15.238.81:56789/oauth";
const portable = process.argv[2] === "portable" ? true : false;
fs.writeFileSync('../core/src/version/version.json', `{"version":"${version}","portable": ${portable},"weblink": "${weblink}"}`)

/**
 * 清除历史构建
 */
shelljs.rm("-rf", "../pack");
shelljs.mkdir("-p", "../pack");
shelljs.rm("-rf", "../dist");

/**
 * 构建Core
 */
shelljs.cd("../core");
shelljs.exec("npm install");
shelljs.exec("npm run build");
shelljs.cp("./dist/*.js", "../pack");
shelljs.cp("../build/package.json", "../pack");

/**
 * 构建ShellApp
 */
shelljs.cd("../shell");
shelljs.exec("rm -rf ./node_module");
shelljs.exec("npm install");
// run elelctron build
shelljs.exec(`npm run rebuild`);

shelljs.exec("npm run build");
shelljs.exec("node devtools/buildservice.js")

/**
 * 构建分发包
 */
shelljs.cd("../pack");

/**
 * 构建二进制包
 */
shelljs.mkdir("-p", "./native");
shelljs.exec("\cp ../build/native-package.json ./native/package.json");
shelljs.cd("native");
shelljs.exec("npm install");
electron_rebuild(['serialport', 'node-pty'])
shelljs.exec("npm uninstall electron-rebuild");
shelljs.cd("../");

shelljs.cd("../build");
shelljs.exec("npm run build");
