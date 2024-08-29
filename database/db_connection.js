var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "futone",
});

// con.connect(function(err){
//     if(err) throw err;
//     console.log('Conectado!')
// });

module.exports = con;