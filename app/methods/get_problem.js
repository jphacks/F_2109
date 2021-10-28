exports.getProblem = function (sql){ 
    const sqlite = require('sqlite3').verbose();
    const db = new sqlite.Database('db/fcoder.sqlite');

    return new Promise((resolve, reject) => {
        db.all(sql, function(err, row) {  
            return resolve(row);
        })
    })
    
    //db.close();
}