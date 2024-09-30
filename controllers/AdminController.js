var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const fs = require('fs');

const EmailController = require('./EmailController');


const adminPage = async (req, res) => {

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
        const motivo = req.body.causa;
        const adminId = req.session.user.id;

        const verifyUser = await conQuery("SELECT * FROM users WHERE id = ?", [userId]);
        if(!verifyUser){
            return res.json({status: "Erro ao deletar usuário. Tente novamente mais tarde"});
        }

        console.log(verifyUser[0].foto)

        // Insere na lista de banidos
        const listaDeBanidos = await conQuery("INSERT INTO banidos VALUES (DEFAULT, ?, ?, ?, DEFAULT)", [verifyUser[0].email, motivo, adminId]);

        // Id do usuário e tabelas onde serão apagados os campos
        const tabelas = ['likes', 'dislikes', 'comentarios', 'criador'];

        // Apagar campos
        for (var tabela of tabelas) {
            var sqlDel = await conQuery("DELETE FROM " + tabela + " WHERE idUser = ?", [userId]);
        }

        // Deletar dados dos campos
        const conta = await conQuery("DELETE FROM users WHERE id = ? LIMIT 1", [userId]);
        const posts = await conQuery("DELETE FROM postagens WHERE idUsuario = ?", [userId]);

        if(verifyUser[0].foto != 'images/user.jpg')

        fs.unlinkSync('public/' + verifyUser[0].foto);

        EmailController.deletaContaEmail(verifyUser[0].email, motivo);

        return res.json({status: 200});

    } catch(err){
        console.log(err)
        return res.json({status: "Ocorreu algum erro " + err})
    }
}

// Banidos
const banidosGET = async (req, res) => {
    const sql = await conQuery("SELECT * FROM banidos");
    
    return res.render('admin/banidos', { sql })
}

const banidosPOST = async (req, res) => {

    // Recebe o e-mail e verifica se está banido
    const email = req.body.email;

    // Tira da lista de banidos
    const sql = await conQuery("DELETE FROM banidos WHERE email = ?", [email]);
    if(!sql){
        return res.json({status: "Erro ao deletar. Tente novamente mais tarde"});
    }

    return res.json({ status: 200 })
};

const delPostagem = async(req, res) => {
    return res.render('admin/delPostagem')
}
const delPostagemPOST = async(req, res) => {

    // Busca a postagem e mostra ao admin
    try{
        if(req.body.postId){

            const postId = req.body.postId;
            const sql = await conQuery("SELECT * FROM postagens WHERE id = ?", [postId]);
            if(!sql || sql.length == 0){
                return res.json({status: "Não existe registros com esse id"});
            }

            return res.json({
                status: 200,
                sql
            });
        }
    } catch(err) {
        console.log(err);
        return res.json({status: "Erro ao buscar dados"})
    }

    // Deleta a postagem
    try{
        if(req.body.delPost){
            const idPost = req.body.delPost;
            const motivo = req.body.motivo;

            const verifyPost = await conQuery("SELECT * FROM postagens WHERE id = ?", [idPost]);
            if(!verifyPost || verifyPost.length == 0){
                return res.json({status: "Erro ao buscar postagem"})
            }

            // Autor da postagem
            const emailPost = await conQuery("SELECT users.email FROM postagens JOIN users WHERE postagens.id = ?", [idPost])

            // Deleta o registro e a foto da postagem
            const delPost = await conQuery("DELETE FROM postagens WHERE id = ?", [idPost]);
            fs.unlinkSync('public/' + verifyPost[0].foto);
            if(!delPost || delPost.length == 0){
                return res.json({status: "Erro ao deletar postagem"});
                
            }

            // Envia um e-mail notificando que a postagem foi deletada
            EmailController.deletaPostEmail(emailPost[0].email, motivo);

            return res.json({status: 200})
        }
    } catch (err) {
        console.log(err)
        return res.json({status: "Erro apagar postagem"})
    }
}

const showBanidos = async(req, res) => {

    const email = req.body.email;

    const sqlSearch = await conQuery("SELECT email, motivo, criado FROM banidos WHERE email = ?", [email]);
    if(!sqlSearch || sqlSearch.length == 0){
        return res.json({status: "Este e-mail não está banido"})
    }

    return res.json({
        status: 200,
        sqlSearch
    })
}   

// Denuncias 
const denuncias = async(req, res) => {
    const sql = await conQuery("SELECT * FROM denuncias WHERE visto = 'N'"); 

    return res.render('admin/denuncias', { sql });
}

const denunciasPOST = async(req, res) => {

    const postId = req.body.postId;
    const userId = req.body.userId;

    const verifyDenuncia = await conQuery("SELECT * FROM denuncias WHERE idPost = ? AND idUser = ?", [postId, userId]);
    if(!verifyDenuncia || verifyDenuncia.length == 0){
        return res.json({status: "Erro ao buscar denúncia. Tente novamente mais tarde"})
    }   

    const sql = await conQuery("UPDATE denuncias SET visto = 'Y' WHERE idPost = ? AND idUser = ?", [postId, userId]);
    if(!sql){
        return res.json({status: "Erro ao marcar como lida. Tente novamente mais tarde"})
    }

    return res.json({status: 200})
}

module.exports = { adminPage, deletarContaCriadorAdmin, deletarContaAdmin, showConta, banidosGET, banidosPOST, delPostagem, delPostagemPOST, showBanidos, denuncias, denunciasPOST };