const { exit } = require('process');

const mainController = {
    async index(req, res){
        res.send('test controller!');
    },

    async test_params(req, res){
        //test/params?a=2109
        const a = req.query.a;
        res.send("testparams:" + a);
    },
    async setup_mysql(req, res){
        const mysql = require('mysql');
        const host = process.env.DB_HOST;
        const user = process.env.DB_USER;
        const pass = process.env.DB_PASS;
        const db = process.env.DB_NAME;

        const con = mysql.createConnection({
            host: host,
            user: user,
            password: pass,
            database: db
        });

        con.connect(function(err){
            if(err) throw err;
            console.log('connected.');
            // con.query('CREATE DATABASE fcoder', function (err, result){
            //     if(err) throw err;
            //     console.log("database created.");
            // });
            // let sql = "CREATE TABLE problem (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, discription TEXT, image VARCHAR(255) NOT NULL, source_code TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)";
            // con.query(sql, function (err, result){
            //     if (err) throw err;
            //     console.log("table created.");
            // });
            // let sql = "INSERT INTO problem(title, discription, image) VALUES('TestProblem1', 'テスト。まごうことなき。テスト。test.aaa', 'p1')";
            // con.query(sql, function(err, result, fields){
            //     if(err) throw err;
            //     console.log(result);
            // });
            let sql = "select * from problem";
            con.query(sql, function(err, result){
                if(err) throw err;
                console.log(result);
            })
        });
        res.send("test mysql");
    },
    async setup_sqlite(req, res){
        const sqlite = require('sqlite3').verbose();                                          
        const db = new sqlite.Database('db/fcoder.sqlite');
        await db.serialize(async function() {

            // db.run('CREATE TABLE IF NOT EXISTS problem (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title text NOT NULL, discription TEXT, image text NOT NULL, source_code TEXT, created_at TIMESTAMP, updated_at TIMESTAMP)');
           
            const stmt = db.prepare("INSERT INTO problem(title, discription, image) VALUES(?, ?, ?)");
            stmt.run(['スタイリッシュ', 'discription', 'p1']);
            stmt.run(['シック', 'discription', 'p2']);
            stmt.run(['ギャラリー', 'テスト。aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'p3']);
            stmt.run(['レスポンシブ/シンプル', 'テスト。44444444まごうことなき。テスト。test.aaa', 'p4']);
            stmt.run(['レスポンシブ/ナチュラル', '', 'p5']);
            stmt.run(['レスポンシブ/IT', '', 'p6']);
            stmt.run(['レスポンシブ/web', '', 'p7']);
            stmt.run(['レスポンシブ/キッチン', '', 'p8']);
            stmt.run(['レスポンシブ/シンプル', '', 'p9']);
            stmt.run(['レスポンシブ/コーヒー', '', 'p10']);
            stmt.finalize();
            
            await db.all("SELECT * FROM problem",async function(err, row) {
                 console.log(row);
                 res.send(row);
              });
              //res.send("test");
           });
           
          db.close();
    },
    async test_sqlite(req, res){
        const crud = require(process.cwd() + '/app/methods/get_problem');
        sql = "SELECT * FROM problem where id = 14";
        const row = await crud.getProblem(sql);
        // console.log(row);
        res.send(row[0].title);
    },

    async test_screenshot(req, res){
        
        
        let url = "https://qiita.com/";
        if(req.query.url){
            url = req.query.url;
        }
        const image_path = process.cwd() + "/screenshot.png";
        console.log(url);
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
        res.set({ 'Access-Control-Allow-Origin': '*' });
        const source_code = req.body.source_code;
        console.log(source_code);
        // setup
        //const domain = "http://localhost:3000/";
        const domain = "http://54.95.10.72:3000/";
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
        res.set({ 'Access-Control-Allow-Origin': '*' });
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
        const temp_image_path = process.cwd() + "/public/images/temp/" + id + ".png";
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
        res.set({ 'Access-Control-Allow-Origin': '*' });
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