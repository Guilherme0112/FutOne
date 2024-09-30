var express = require('express');
var app = express();
const session = require('express-session');
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const fs = require('fs');

// Página das postagens
const postagemPage = async (req, res) => {

    try{
        // Pega o id passado na url
        const user = req.session.user;
        const idPost = req.params.id;
        var perfil = sessao = like = dislike = "";
        const post = await conQuery("SELECT * FROM postagens WHERE id = ? LIMIT 1", [idPost]);

        if(!post || post.length === 0){
            return res.redirect('/');
        }

        // Dados do usuário da sessão
        if(user){
            perfil = await conQuery("SELECT * FROM users WHERE id = ?", [user.id]);
        }

        var comentarios = await conQuery("SELECT users.id, users.nome, users.foto, comentarios.* FROM comentarios JOIN users ON comentarios.idUser = users.id WHERE idPost = ? LIMIT 10", [idPost]);
        if(user){
            var like = await conQuery("SELECT * FROM likes WHERE idPost = ? AND idUser = ?", [idPost, user.id]);

            var dislike = await conQuery("SELECT * FROM dislikes WHERE idPost = ? AND idUser = ?", [idPost, user.id]);
        }
        
        if (!post) {
            return res.redirect('/');
        }
        
        return res.render('post', { post, perfil, comentarios, user, like, dislike});

    } catch(err){

        console.log(err);
        return res.redirect('/');
    }
};

    // Criar postagem
    // GET

const criarPostagemGET = async (req, res) => {
    
    // Verifica se o usuario é criador
    const criador = await conQuery('SELECT * FROM criador WHERE idUser = ?', [req.session.user.id]);
    if(criador.length > 0){
        return res.render('criar', {erro: ''});
    } else {
        return res.redirect('/');
    }
        

}

    // POST

const criarPostagemPOST = async (req, res) => {
    // console.log(req.file.mimetype);

    if(req.session.user){
        const titulo = req.body.titulo;
        const assunto = req.body.assunto;
        const tags = req.body.tags;
        const imagem = 'uploads/posts/' + req.file.filename;
        
    // Valida os campos e apaga a imagem caso a validação não passe

        if(req.file.mimetype != 'image/png' && req.file.mimetype != 'image/jpg' && req.file.mimetype != 'image/jpeg' ){
            fs.unlink('public/' + imagem, (err) => {
                if(err) throw err;
            })
            console.log('Apagado com sucesso');
            return res.render('criar', {erro: 'Somente imagens do tipo: PNG, JPEG e JPG são aceitas'});
        }

        if(titulo.length < 3 || titulo.length > 100){
            fs.unlink('public/' + imagem, (err) => {
                if(err) throw err;
            });      
            console.log('Apagado com sucesso');
            return res.render('criar', {erro: 'O título deve ter entre 3 e 100 caracteres'});
        }
        
        if(assunto.length < 50 || assunto.length > 2000){
            fs.unlink('public/' + imagem, (err) => {
                if(err) throw err;
            });      
            console.log('Apagado com sucesso');
            return res.render('criar', {erro: 'A postagem deve ter entre 50 e 2000 caracteres'});
        }
        
        // Insere os dados no banco de dados
        
        const sql = await conQuery('INSERT INTO postagens VALUES (DEFAULT, ?, ?, ?, ?, ?, DEFAULT)', [imagem, titulo, assunto, tags, req.session.user.id])
        if(!sql){
            fs.unlink('public/' + imagem, (err) =>{
                if(err) throw err;
                console.log('Apagado com sucesso');
            });
        }
        res.redirect('/perfil');

    } else {
        if(req.file){
            fs.unlink(req.file.path, (err) => {
                if(err) throw err;
            });
        }
        res.redirect('/');
    }
}

// Sistema de denúncia
const fazerDenuncia = async (req, res) => {

    try{
        const postId = req.body.postId;
        const userId = req.session.user.id;
        var motivo = req.body.select;

        const verifyDenuncia = await conQuery("SELECT * FROM denuncias WHERE idUser = ? AND idPost = ?", [userId, postId]);
        if(verifyDenuncia.length > 0){
            return res.json({status: "Você já denunciou esta postagem"})
        }

        const verifyPost = await conQuery("SELECT * FROM postagens WHERE id = ?", [postId]);
        if(!verifyPost || verifyPost.length == 0){
            return res.json({status: "Não foi realizar a denúncia. Tente novamente mais tarde"})
        }

        // Verifica o motivo da denúncia
        switch (motivo) {
            case '0':
                motivo = "Conteudo Inapropriado";
                break;
            case '1':
                motivo = "Spam";
                break;
            case '2':
                motivo = "Contém palavras agressivas";
                break;
            case '3':
                motivo = "Fora do contexo";
                break;
            default:
                return res.json({status: "Valor Inválido"})
                break;
        }


        const sql = await conQuery("INSERT INTO denuncias VALUES (DEFAULT, ?, ?, ?, DEFAULT, DEFAULT)", [userId, motivo, postId]);
        if(!sql || sql.length == 0){
            return res.json({status: "Não foi possível fazer a denúncia. Tente novamente mais tarde"});
        }

        return res.json({status: 200});

    } catch (err) {

        console.log(err)
        return res.json({status: "Erro ao processar denúncia. Tente novamente mais tarde"})
    }
}

module.exports = { postagemPage, criarPostagemGET, criarPostagemPOST, fazerDenuncia };