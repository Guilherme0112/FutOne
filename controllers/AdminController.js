var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);

const adminPage = async (req, res) => {
    
    const userId = req.session.user.id;

    return res.render('admin/admin');
}

// Deletar conta principal
const deletarContaCriadorAdmin = async (req, res) => {

    return res.render('admin/conta');
}

// Exibe a conta na tela para o admin deletar
const showConta = async(req, res) => {
    try{
        
        const userId = req.body.id;
            
        const verifyUser = await conQuery("SELECT id, nome, email, foto FROM users WHERE id = ?", [userId]);
        if(!verifyUser || verifyUser.length == 0){
            return res.json({status: "Erro ao buscar usuário. Tente novamente mais tarde"});
        }

        return res.json({verifyUser});

    } catch (err) {

        return res.json({status: 500});
    }

}

// Deleta a conta de criador
const deletarContaAdmin = async (req, res) => {
    try{

    
        const userId = req.body.id;
        const motivo = req.body.motivo;
        const adminId = req.session.user.id;

        const verifyUser = await conQuery("SELECT * FROM users WHERE id = ?", [userId]);
        if(!verifyUser){
            return res.json({status: "Erro ao deletar usuário. Tente novamente mais tarde"});
        }

        // Insere na lista de banidos
        const listaDeBanidos = await conQuery("INSERT INTO banidos VALUES (DEFAULT, ?, ?, ?, DEFAULT)", [verifyUser[0].email], motivo, adminId);

        // Id do usuário e tabelas onde serão apagados os campos
        const tabelas = ['likes', 'dislikes', 'comentarios', 'criador'];

        // Apagar campos
        for (var tabela of tabelas) {
            var sqlDel = await conQuery("DELETE FROM " + tabela + " WHERE idUser = ?", [userId]);
        }

        // Deletar dados dos campos
        const conta = await conQuery("DELETE FROM users WHERE id = ? LIMIT 1", [userId]);
        const posts = await conQuery("DELETE FROM postagens WHERE idUsuario = ?", [userId]);

        return res.json({status: 200});

    } catch(err){

        return res.json({status: "Ocorreu algum erro " + err})
    }
}

// Banidos

const banidosGET = async (req, res) => {
    return res.render('admin/banidos')
}

const banidosPOST = async (req, res) => {

    // Recebe o e-mail e verifica se está banido
    const email = req.body.email;

    const verifyEmail = await conQuery("SELECT * FROM banidos WHERE email = ?", [email]);
    if(!verifyEmail || verifyEmail.length == 0){
        return res.json({status: "Não existe este email na lista de banidos"});
    }


    return res.json({
        status: 200,
        verifyEmail
    })
}

module.exports = { adminPage, deletarContaCriadorAdmin, deletarContaAdmin, showConta, banidosGET, banidosPOST };