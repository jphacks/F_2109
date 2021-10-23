const mainController = {
    async index(req, res){
        res.send('test controller');
    },

    async test_params(req, res){
        //test/params?a=2109
        const a = req.query.a;
        res.send("testparams:" + a);
    }
}

module.exports = mainController;