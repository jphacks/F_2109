const mainController = {
    async index(req, res){
        res.send('test controller');
    },

    async test_params(req, res){
        //test/params?a=2109
        const a = req.query.a;
        res.send("testparams:" + a);
    },

    async test_screenshot(req, res){
        
        
        const url = "http://localhost:3000/testuser_p1/root/";
        const image_path = process.cwd() + "../../backend/public/images/temp/screenshot.png";
        
        const screenshot = require(process.cwd() + '/app/methods/screenshot');
        await screenshot.takeScreenshot(url, image_path);
        
        res.send('test screenshotttt.');

    },

    async test_regcli(req, res){
        
        const actualFilename = "public/images/correct/test_reg_left.jpg";
        const expectedFilename = "public/images/temp/test_reg_right.jpg";
        const diffFilename = "public/images/diff/diff.png";
        const score = await require(process.cwd() + "/app/methods/check_pixel").checkPixel(actualFilename,expectedFilename,diffFilename);
        
        res.send('test score : ' + score);
    },
    async test_api(req, res){
        const r = req.body.text;
        console.log(r);
        res.json({'text': r});
    },
    async test_api_get(req, res){
        res.json({message:"test_api_get."});
    },

    async uploadSubmit(req, res){

        const source_code = req.body.source_code;

        console.log(source_code);
        // setup
        const domain = "http://localhost:3000/";
        const user = "testuser";
        const problem = "p1";
        const id = user + "_" + problem;
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
        const url = req.body.url;
        console.log(url);

        const problem = "p1"; //default at version 0.1.0
        const user = "testuser"; //default at version 0.1.0
        const id = user + "_" + problem; // p1_testuser

        // check existing uploaded dir, if false, imgScore = -1
        const fs = require('fs');
        if(fs.existsSync("code/" + id) == false){
            res.json({ "imgScore": -1 });
        }
        //screenshot
        const temp_image_path = process.cwd() + "../../backend/public/images/temp/" + id + ".png";
        const screenshot = require(process.cwd() + '/app/methods/screenshot');
        await screenshot.takeScreenshot(url, temp_image_path);

        //pixel check
        const correctFilename = "public/images/correct/" + problem + ".png";
        const tempFilename = "public/images/temp/" + id + ".png";
        const diffFilename = "public/images/diff/" + id + ".png";
        const score = await require(process.cwd() + "/app/methods/check_pixel").checkPixel(correctFilename,tempFilename,diffFilename);

        //remove temp, diff files, uploaded dir
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
        const id = req.body.id;
        const fs = require('fs');
        try {
            if(fs.existsSync("code/" + id)){
              fs.rmdirSync("code/" + id, { recursive:true });
            }
          } catch (error) {
            throw error;
          }
        res.json({ "message": "closed." });
    }
}

module.exports = mainController;