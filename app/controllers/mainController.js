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
        const image_path = process.cwd() + "../../backend/public/images/temp/";
        
        const screenshot = require(process.cwd() + '/app/methods/screenshot');
        await screenshot.takeScreenshot(url, image_path);
        
        res.send('test screenshotttt.');

    },

    async test_regcli(req, res){
        console.log("test");
        const { imgDiff } = require("img-diff-js");

        imgDiff({
            actualFilename: "public/images/correct/test_reg_left.jpg",
            expectedFilename: "public/images/temp/test_reg_right.jpg",
            diffFilename: "public/images/diff/diff.png",
        }).then(result => console.log(result));
        res.send('test reg-cli.');
    }
}

module.exports = mainController;