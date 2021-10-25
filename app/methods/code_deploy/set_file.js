exports.setFile = async function (files, code_path){
    await files.forEach(file => {
        const fileName = file.fileName;
        const code = file.code;
        const fs = require('fs');
        fs.writeFileSync(code_path+"/"+fileName, code);
    });
}