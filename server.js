const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;

const dir_path = process.cwd();

const mainController = require(dir_path + "/app/controllers/mainController");
const v2Controller = require(dir_path + "/app/controllers/v2Controller");

require('dotenv').config();

app.use(cors())

app.use(express.static('code'));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get('/', (req, res) => {
    res.send('test express.');
})
app.get("/api", (req, res) => {
    res.json({ message: "test api." })
})
app.get('/api/test', mainController.test_api_get);
app.post("/api/test", mainController.test_api);

app.get("/test", mainController.index);
app.get("/test/params", mainController.test_params);
app.get("/test/test_screenshot", mainController.test_screenshot);
app.get('/test/test_regcli', mainController.test_regcli);
app.get('/test/test_sqlite', mainController.test_sqlite);

app.get("/setup_mysql", mainController.setup_mysql);

app.get('/setup_sqlite', mainController.setup_sqlite);
//app.get("/api/upload", mainController.uploadSubmit);

//submit from frontend
app.post("/v0.1.0/upload", mainController.uploadSubmit);
app.post("/v0.1.0/imgScore", mainController.getImgScore);
app.post("/v0.1.0/close", mainController.closeSubmit);

// v0.2.0
app.post("/v0.2.0/upload", v2Controller.uploadSubmit);
app.post("/v0.2.0/imgScore", v2Controller.getImgScore);
app.post("/v0.2.0/close", v2Controller.closeSubmit);
app.get("/v0.2.0/problem", v2Controller.getPList);
app.post("/v0.2.0/problem/detail", v2Controller.getPDetail);



app.listen(port, () => {
    console.log(`listening on *:${port}`);
})