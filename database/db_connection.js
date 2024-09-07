var mysql = require('mysql');
require('dotenv').config();

// console.log(process.env);

var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

// con.connect(function(err){
//     if(err) throw err;
//     console.log('Conectado!')
// });

module.exports = con;