const { exit } = require('process');

const v2Controller = {
  async setup_sqlite(req, res){
    const sqlite = require('sqlite3').verbose();                                          
    const db = new sqlite.Database('db/fcoder.sqlite');
    await db.serialize(async function() {

        // db.run('CREATE TABLE IF NOT EXISTS problem (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title text NOT NULL, description TEXT, image text NOT NULL, source_code TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)');
        db.run('CREATE TABLE problem (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title text NOT NULL, description TEXT, image text NOT NULL, source_code TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)');
      
        const stmt = db.prepare("INSERT INTO problem(title, description, image) VALUES(?, ?, ?)");
        stmt.run(['スタイリッシュ', 'スタイリッシュな美容室・アパレル・カフェ・ショップ向けの会社紹介サイトです。', 'p1']);
        stmt.run(['シック', 'シックな美容室・アパレル・カフェ・ショップ向けの会社紹介サイトです。', 'p2']);
        stmt.run(['ファッション', 'ファッショナブルな美容室・アパレル・カフェ・ショップ向けの会社紹介サイトです。', 'p3']);
        stmt.run(['シンプル', 'よくあるタイプのものでシンプルな企業紹介サイトです。', 'p4']);
        stmt.run(['フラワー', 'WEBサイト全体で花をモチーフにした企業紹介サイトです。', 'p5']);
        stmt.run(['IT', 'IT業界向けの企業紹介サイトです。日本の情報機関にありそうなホームページです。', 'p6']);
        stmt.run(['web', 'web業界向けの企業紹介サイトです。必要な情報を簡単に書くことができます。', 'p7']);
        stmt.run(['キッチン', 'キッチンをモチーフにした施工業者向け企業紹介サイトです。', 'p8']);
        stmt.run(['ナチュラル', '自然をモチーフにした企業紹介サイトです。', 'p9']);
        stmt.run(['コーヒー', 'カフェ向けの企業の紹介ページです。写真の光彩が鮮やかに加工されています。', 'p10']);
        stmt.run(['チュートリアル１', '基本的なCSSのチュートリアル。最も初級者向けの問題です。', 'p11']);
        stmt.run(['チュートリアル２', 'Flexboxの練習用チュートリアル。要素の並べ方の練習に最適です。', 'p12']);
        stmt.run(['チュートリアル３', 'Grid Layoutの練習用チュートリアル。四本のアンテナを並べましょう。', 'p13']);
        stmt.finalize();
        
        await db.all("SELECT * FROM problem",async function(err, row) {
             console.log(row);
             res.send(row);
          });
          //res.send("test");
       });
       
      db.close();
},
    async uploadSubmit(req, res){
        res.set({ 'Access-Control-Allow-Origin': '*' });
        const sourceCode = req.body.sourceCode;
        const user = req.body.userId;
        const problem = req.body.problemImageName;
        const id = user + "_" + problem;

        console.log(sourceCode);
        // setup
        //const domain = "http://localhost:3000/";
        const domain = "https://frontcoder.net/";
        
        const code_path = process.cwd() + "/code/" + id + "/root";

        const url = domain + id + "/root"; // root URL at localhost

        const fs = require('fs');
        if(fs.existsSync("code/" + id)){
            fs.rmdirSync("code/" + id, { recursive:true });
          }
        fs.mkdirSync(code_path, { recursive:true }); // create root dir

        if('file' in sourceCode){
            const setFile = require(process.cwd() + "/app/methods/code_deploy/set_file");
            await setFile.setFile(sourceCode.file, code_path); //http://localhost:3000/testuser_p1/root/index.html
        }
        if('dir' in sourceCode){
            const setDir = require(process.cwd() + "/app/methods/code_deploy/set_dir");
            await setDir.setDir(sourceCode.dir, code_path);
        }
        res.json({
            "url": url
        });
    },

    async getImgScore(req, res){
        res.set({ 'Access-Control-Allow-Origin': '*' });
        const url = req.body.url;
        console.log(url);

        const problem = req.body.problemImageName;
        const user = req.body.userId;
        const id = user + "_" + problem; // p1_testuser

        // check existing uploaded dir, if false, imgScore = -1
        const fs = require('fs');
        if(fs.existsSync("code/" + id) == false){
            res.json({ "imgScore": -1 });
        }

        //create dir /public/images/temp/[[user_id]]/[[problem]].png
        const temp_path = process.cwd() + "/public/images/temp/" + user;
        const diff_path = process.cwd() + "/public/images/diff/" + user;
        const correct_path = process.cwd() + "/public/images/correct/" + problem;
        if(fs.existsSync(temp_path)){
          fs.rmdirSync(temp_path, { recursive:true });
          fs.rmdirSync(diff_path, { recursive:true });
        }
        fs.mkdirSync(temp_path, { recursive:true });
        fs.mkdirSync(diff_path, { recursive:true });

        //screenshot
        const temp_image_path = temp_path + "/" + problem + ".png";
        const screenshot = require(process.cwd() + '/app/methods/screenshot');
        await screenshot.takeScreenshot(url, temp_image_path);

        //pixel check
        const correctFilename = correct_path + "/" + problem + ".png";
        const tempFilename = temp_path + "/" + problem + ".png";
        const diffFilename = diff_path + "/" + user + ".png";
        const score = await require(process.cwd() + "/app/methods/check_pixel").checkPixel(correctFilename,tempFilename,diffFilename);

        //reg-cli
        const report_path = process.cwd() + "/public/reports/" + id + ".html";
        const cmd = '"./node_modules/.bin/reg-cli" ' + correct_path + ' ' + temp_path + ' ' + diff_path + ' -R ' + report_path;

        child = require('child_process').exec(cmd, (err, stdout, stderr) => {
            //console.log('err:', err);
            console.log('stdout:', stdout);
        })

        //remove temp, diff files
        // try {
        //   fs.unlinkSync("public/images/temp/" + id + ".png");
        //   fs.unlinkSync("public/images/diff/" + id + ".png");
        // } catch (error) {
        //   throw error;
        // }

        res.json({
            "imgScore": score,
            "report": "https://frontcoder.net/reports/" + id + ".html"
        });
    },
    async closeSubmit(req, res){
        res.set({ 'Access-Control-Allow-Origin': '*' });

        const problem = req.body.problemImageName;
        const user = req.body.userId;
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