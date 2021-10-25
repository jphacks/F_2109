const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const dir_path = process.cwd();

const mainController = require(dir_path + "/app/controllers/mainController");

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

app.get("/api/upload", mainController.uploadSubmit);
//submit from frontend
app.post("/api/upload", mainController.uploadSubmit);
app.post("/api/imgScore", mainController.getImgScore);





app.listen(port, () => {
    console.log(`listening on *:${port}`);
})