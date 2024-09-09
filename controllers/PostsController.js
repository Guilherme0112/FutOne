var express = require('express');
var app = express();
const session = require('express-session');
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);

    // Página das postagens

const postagemPage = async (req, res) => {

    // Pega o id passado na url

    var idPost = req.params.id;
    const post = await conQuery("SELECT * FROM postagens WHERE id = ? LIMIT 1", [idPost]);
        if (post) {
            // console.log(post[0].id)
            res.render('post', { post });
        } else {
            res.redirect('/');
        }
};

    // Criar postagem
    // GET

const criarPostagemGET = async (req, res) => {
    if(req.session.user){

    // Verifica se o usuario é criador

        const criador = await conQuery('SELECT * FROM criador WHERE idUser = ?', [req.session.user.id]);
        if(criador.length > 0){
            res.render('criar', {erro: ''});
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
}

    // POST

const criarPostagemPOST = async (req, res) => {
    // console.log(req.body);

    if(req.session.user){
        const titulo = req.body.titulo;
        const assunto = req.body.assunto;
        const tags = req.body.tags;
        const imagem = 'uploads/' + req.file.filename;
        
    // Valida os campos e apaga a imagem caso a validação não passe

        if(titulo.length < 3 || titulo.length > 100){
            fs.unlink(imagem, (err) => {
                if(err) throw err;
            });      
            return res.render('criar', {erro: 'O título deve ter entre 3 e 100 caracteres'});
        }
        
        if(assunto.length < 50 || assunto.length > 2000){
            fs.unlink('public/' + imagem, (err) => {
                if(err) throw err;
            });      
            return res.render('criar', {erro: 'A postagem deve ter entre 50 e 2000 caracteres'});
        }

        // Insere os dados no banco de dados

        const sql = await conQuery('INSERT INTO postagens VALUES (DEFAULT, ?, ?, ?, ?, ?, DEFAULT)', [imagem, titulo, assunto, tags, req.session.user.id])
        if(!sql){
            fs.unlink('public/' + imagem);
            throw err;
        }
        res.redirect('/perfil');

    } else {
        res.redirect('/');
    }
}

module.exports = { postagemPage, criarPostagemGET, criarPostagemPOST };