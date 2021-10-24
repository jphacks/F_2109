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
        
        
        const url = "https://liginc.co.jp/492752";
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

    async review_submit(req, res){
        //receive html, css, js files

        //validation submit

        //deploy files

        //get deploy servers URL

        const url = "https://submarine21.herokuapp.com/search?keyword=%E3%83%93%E3%82%B8%E3%83%8D%E3%82%B9"; //tentative URL of Heroku
        const problem = "p1"; //default at version 0.1.0
        const user = "testuser"; //default at version 0.1.0
        const id = user + "_" + problem; // p1_testuser

        //screenshot
        const temp_image_path = process.cwd() + "../../backend/public/images/temp/" + id + ".png";
        const screenshot = require(process.cwd() + '/app/methods/screenshot');
        await screenshot.takeScreenshot(url, temp_image_path);

        //pixel check
        const correctFilename = "public/images/correct/" + problem + ".png";
        const tempFilename = "public/images/temp/" + id + ".png";
        const diffFilename = "public/images/diff/" + id + ".png";
        const score = await require(process.cwd() + "/app/methods/check_pixel").checkPixel(correctFilename,tempFilename,diffFilename);

        //remove temp, diff files
        const fs = require('fs');

        try {
          fs.unlinkSync("public/images/temp/" + id + ".png");
          fs.unlinkSync("public/images/diff/" + id + ".png");
        } catch (error) {
          throw error;
        }

        res.json({
            "url": url,
            "imgScore": score
        });
    }
}

module.exports = mainController;