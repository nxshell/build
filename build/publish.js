const SftpClient = require('ssh2-sftp-client')
const cliProgress = require('cli-progress');

const fs = require('fs');
const path = require('path');
const os = require('os');

function get_upload_file() {
     let list = fs.readdirSync('../dist/apppackage');
     let files = [];
     let os_type = os.platform();
     if(os_type === 'win32') {
         files = list.filter((e)=> { return e.endsWith('.appx') || e.endsWith('.exe')})
     } else if(os_type === 'darwin') {
         files = list.filter((e)=> { return e.endsWith('.dmg') })
     } else {
         files = list.filter((e)=> { return e.endsWith('.deb') || e.endsWith('.AppImage')})
     }
     return files;
}


const options = {
   host: process.env.PUBLISH_HOST,
   port: process.env.PUBLISH_PORT,
   username: process.env.PUBLISH_USER,
   password: process.env.PUBLISH_PWD,
};

async function upload_files(files) {
    const sftp = new SftpClient();
     console.log('options ', options)
     console.log('env ', process.env)
    await sftp.connect(options);
    
    for (const f of files) {
        let local = path.join('../dist/apppackage', f);
        let remote = ['/incoming/github', f].join('/');
        const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        console.log(`Upload file ${f}`);
        await sftp.fastPut(local, remote, {
            step: (total_trans, chunk, total) => {
                bar1.start(total, total_trans);
            }
        })
        bar1.stop();
    }
    sftp.end();
}

upload_files(get_upload_file());
