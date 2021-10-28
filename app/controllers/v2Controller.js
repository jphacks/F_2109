const { exit } = require('process');

const v2Controller = {
    async uploadSubmit(req, res){
        res.set({ 'Access-Control-Allow-Origin': '*' });
        const source_code = req.body.source_code;
        const user = req.body.user_id;
        const problem = req.body.problem_image_name;
        const id = user + "_" + problem;

        console.log(source_code);
        // setup
        //const domain = "http://localhost:3000/";
        const domain = "http://54.95.10.72:3000/";
        
        const code_path = process.cwd() + "/code/" + id + "/root";

        const url = domain + id + "/root"; // root URL at localhost

        const fs = require('fs');
        if(fs.existsSync("code/" + id)){
            fs.rmdirSync("code/" + id, { recursive:true });
          }
        fs.mkdirSync(code_path, { recursive:true }); // create root dir

        if('file' in source_code){
            const setFile = require(process.cwd() + "/app/methods/code_deploy/set_file");
            await setFile.setFile(source_code.file, code_path); //http://localhost:3000/testuser_p1/root/index.html
        }
        if('dir' in source_code){
            const setDir = require(process.cwd() + "/app/methods/code_deploy/set_dir");
            await setDir.setDir(source_code.dir, code_path);
        }
        res.json({
            "url": url
        });
    },

    async getImgScore(req, res){
        res.set({ 'Access-Control-Allow-Origin': '*' });
        const url = req.body.url;
        console.log(url);

        const problem = req.body.problem_image_name;
        const user = req.body.user_id;
        const id = user + "_" + problem; // p1_testuser

        // check existing uploaded dir, if false, imgScore = -1
        const fs = require('fs');
        if(fs.existsSync("code/" + id) == false){
            res.json({ "imgScore": -1 });
        }
        //screenshot
        const temp_image_path = process.cwd() + "/public/images/temp/" + id + ".png";
        const screenshot = require(process.cwd() + '/app/methods/screenshot');
        await screenshot.takeScreenshot(url, temp_image_path);

        //pixel check
        const correctFilename = "public/images/correct/" + problem + ".png";
        const tempFilename = "public/images/temp/" + id + ".png";
        const diffFilename = "public/images/diff/" + id + ".png";
        const score = await require(process.cwd() + "/app/methods/check_pixel").checkPixel(correctFilename,tempFilename,diffFilename);

        //remove temp, diff files
        try {
          fs.unlinkSync("public/images/temp/" + id + ".png");
          fs.unlinkSync("public/images/diff/" + id + ".png");
        } catch (error) {
          throw error;
        }

        res.json({
            "imgScore": score
        });
    },
    async closeSubmit(req, res){
        res.set({ 'Access-Control-Allow-Origin': '*' });

        const problem = req.body.problem_image_name;
        const user = req.body.user_id;
        const id = user + "_" + problem;
        const fs = require('fs');
        try {
            if(fs.existsSync("code/" + id)){
              fs.rmdirSync("code/" + id, { recursive:true });
            }
          } catch (error) {
            throw error;
          }
        res.json({ "message": "closed." });
    },
    async getPList(req, res){
        res.set({ 'Access-Control-Allow-Origin': '*' });
        const get_problem = require(process.cwd() + '/app/methods/get_problem');
        const sql = "SELECT * FROM problem";
        const problems = await get_problem.getProblem(sql);
        res.json({"problem": problems});
    },
    async getPDetail(req, res){
        res.set({ 'Access-Control-Allow-Origin': '*' });
        const id = req.body.id;
        const get_problem = require(process.cwd() + '/app/methods/get_problem');
        const sql = "SELECT * FROM problem WHERE id = " + id;
        const problems = await get_problem.getProblem(sql);
        res.json({"problem": problems[0]});
    }
}

module.exports = v2Controller;