const session = require('express-session');
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);

const generateIndex = async (req, res) => {
    var page = req.params.id;

    var offset = (page - 1 ) * 5;

    const sql = await conQuery("SELECT * FROM postagens LIMIT 5 OFFSET ?", [offset]);
    
    if(sql){
        res.json(sql);
    } else {
        res.json("Sem dados")
    }
}


module.exports = { generateIndex };