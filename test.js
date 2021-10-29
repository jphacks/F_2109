

const correct_path = "public/images/correct/p2";
const temp_path = "public/images/temp/3";
const diff_path = "public/images/diff/3";
const report_path = "public/reports/3_p2.html";

const cmd = '"./node_modules/.bin/reg-cli" ' + correct_path + ' ' + temp_path + ' ' + diff_path + ' -R ' + report_path;

child = require('child_process').exec(cmd, (err, stdout, stderr) => {
    //console.log('err:', err);
    console.log('stdout:', stdout);
})