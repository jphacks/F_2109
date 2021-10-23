const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const dir_path = process.cwd();

const mainController = require(dir_path + "/app/controllers/mainController");

app.get('/', (req, res) => {
    res.send('test express.');
})
app.get("/api", (req, res) => {
    res.json({ message: "test api." })
})

app.get("/test", mainController.index);
app.get("/test/params", mainController.test_params);







app.listen(port, () => {
    console.log(`listening on *:${port}`);
})