var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);


const editarPerfilGET = async (req, res) => {
    if(req.session.user){
        const idUser = req.session.user.id;

        const user = await conQuery("SELECT nome, foto, email, criado FROM users WHERE id = ? LIMIT 1", [idUser]);

        if(user){
            return res.render('editarPerfil', { user });
        }
        return res.redirect('/perfil');
    }
    return res.redirect('/');
}

const editarPerfilPOST = async (req, res) => {
    if(req.session.user){
    console.log(req.body);
    return res.redirect('/perfil/editar');
    }
}

module.exports = { editarPerfilGET, editarPerfilPOST };