exports.setDir = async function (dirs, dir_path){
    const setFile = require('./set_file');
    const setDir = require('./set_dir');
    const fs = require('fs');
    //console.log(dirs);
    await dirs.forEach(dir => {
        const code_path = dir_path + "/" + dir.dirName;
        //console.log(code_path);
        fs.mkdirSync(code_path, { recursive:true });
        if('file' in dir){
            setFile.setFile(dir.file, code_path);
        }
        if('dir' in dir){
            setDir.setDir(dir.dir, code_path);
        }
    });
}