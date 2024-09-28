var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);

const isAdmin = async (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/');
    }

    // Verifica se o usuário é admin
    const userId = req.session.user.id;

    const sql = await conQuery("SELECT * FROM admin WHERE idUser = ?", [userId]);
    if(!sql ||sql.length == 0){
        return res.redirect('/');
    }

    next();

}

module.exports = { isAdmin };