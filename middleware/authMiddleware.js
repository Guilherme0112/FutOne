var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);

const isAuth = async (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/');
    }

    next();
}

module.exports = { isAuth };