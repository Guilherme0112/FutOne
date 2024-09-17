const { table } = require('console');
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const logout = require('./AuthController');


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
        const delConta = req.body.conta;
        // console.log(delConta);

    // Verifica se é realmente para apagar a conta

        if(delConta === true){
            try{
                const idUser = req.session.user.id;

                const tabelas = ['likes', 'dislikes', 'comentarios', 'criador'];

                for(var tabela of tabelas){

                    var sqlDel = await conQuery("DELETE FROM " + tabela + " WHERE idUser = ?",  [idUser]);
                }

                const conta = await conQuery("DELETE FROM users WHERE id = ?", [idUser]);
                const posts = await conQuery("DELETE FROM postagens WHERE idUsuario = ?", [idUser]);

                // Destrói a sessão

                req.session.destroy(async (err) => {
                    if (err) {
                        return res.json({erro: err})
                    } 

                    return res.json({
                        status: 200,
                        redirect: '/login'
                    })

                })
            } catch (error){
                return res.json({status: "Erro ao apagar a conta: " + error});
            }
        }
    }
}

module.exports = { editarPerfilGET, editarPerfilPOST };