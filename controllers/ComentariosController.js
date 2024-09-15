var express = require('express');
var app = express();
var con = require('../database/db_connection');
const { promisify } = require('util');
const { exit } = require('process');
const conQuery = promisify(con.query).bind(con);

// Lógica para inserir comentários

const commentPage = async (req, res) => {
    if(req.session.user){
        const comentario = req.body.comment;
        const idUser = req.session.user.id;
        const idPost = req.body.idPost

        var verifyPost = await conQuery("SELECT * FROM postagens WHERE id = ?", [idPost]);
        // console.log(comentario, idUser, idPost);

    // Verifica se a postagem realmente existe 

        if(verifyPost){
            if(comentario.length > 0){
                var sql = await conQuery("INSERT INTO comentarios VALUES (DEFAULT, ?, ?, ?, DEFAULT)", [comentario, idUser, idPost]);
                if(!sql) throw err;

                // Busca o id do comentário que acabou de ser inserido e faz o SELECT para mandar os dados para o front-end

                var idComentarioRegistrado = sql.insertId;
                var comentarioSQL = await conQuery("SELECT users.id, users.nome, users.foto, comentarios.*, date_format(comentarios.criado, '%d/%m/%Y') FROM comentarios JOIN users ON users.id = comentarios.idUser WHERE comentarios.id = ?", [idComentarioRegistrado]);

                res.json({comentarioSQL});
            }
        } else {
            res.json({erro: "Erro ao enviar comentário"});
        }

    }
}

// Lógica para deletar comentário

const deleteComment = async (req, res) => {
    if(req.session.user){
        var idComentario = req.body.idComment;
        var verifyComentario = await conQuery("SELECT * FROM comentarios WHERE id = ? AND idUser = ?", [idComentario, req.session.user.id]);

        if(verifyComentario.length > 0){
            var delComentario = await conQuery("DELETE FROM comentarios WHERE id = ? AND idUser = ? LIMIT 1", [idComentario, req.session.user.id]);
            if(delComentario){

                return res.json({status: 200});
            }
        }

        return res.json({status: 403});

    }
}

// Lógica para gerar comentários de acordo com o scroll

const generateComments = async(req, res) => {

}

// Lógica dos likes em postagens

const like = async(req, res) => {
    if(req.session.user){
        // console.log(req.session.user.id);
        const idPost = req.body.idPost;

        // Verifica se o id do post realmente existe

        var verifyPost = await conQuery("SELECT * FROM postagens WHERE id = ?", [idPost]);
        if(!verifyPost){
            return res.json({status: 404});
        }

        // Verifica se o usuário já curtiu o post para adicionar ou remover caso já tenha o like

        var verifyLike = await conQuery("SELECT * FROM likes WHERE idUser = ? AND idPost = ?", [req.session.user.id, idPost]);

        if(verifyLike.length > 0){
            var deleteLike = await conQuery("DELETE FROM likes WHERE idUser = ? AND idPost = ? LIMIT 1", [req.session.user.id, idPost]);
            if(!deleteLike){
                return res.json({status: 500});
            }
            return res.json({status: 201});
        }

        // Insere caso não tenha o like
        
        if(verifyLike.length === 0){
            var inserirLike = await conQuery("INSERT INTO likes VALUES (DEFAULT, ?, ?, DEFAULT)", [idPost, req.session.user.id])
            if(!inserirLike){
                return res.json({status: 400})
            }

            // Apaga o dislike quando existe o like

            var deleteLike = await conQuery("DELETE FROM dislikes WHERE idUser = ? AND idPost = ? LIMIT 1", [req.session.user.id, idPost]);
            if(deleteLike){
                return res.json({status: 201});
            }

            return res.json({status: 200});
        }
    }
}

// Lógica dos deslikes em postagens

const deslike = async(req, res) => {
    if(req.session.user){
        // console.log(req.session.user.id);
        const idPost = req.body.idPost;

        // Verifica se o id do post realmente existe

        var verifyPost = await conQuery("SELECT * FROM postagens WHERE id = ?", [idPost]);
        if(!verifyPost){
            return res.json({status: 404});
        }

        // Verifica se o usuário já deu dislike ao post para adicionar ou remover caso já tenha o dislike

        var verifyLike = await conQuery("SELECT * FROM dislikes WHERE idUser = ? AND idPost = ?", [req.session.user.id, idPost]);

        if(verifyLike.length > 0){
            var deleteLike = await conQuery("DELETE FROM dislikes WHERE idUser = ? AND idPost = ? LIMIT 1", [req.session.user.id, idPost]);
            if(deleteLike){
                return res.json({status: 201});
            }
            return res.json({status: 500});
        }

        // Insere caso não tenha o dislike

        if(verifyLike.length === 0){
            var inserirLike = await conQuery("INSERT INTO dislikes VALUES (DEFAULT, ?, ?, DEFAULT)", [idPost, req.session.user.id])
            if(!inserirLike){
                return res.json({status: 400})
            }

            // Apaga o dislike quando existe o like

            var deleteLike = await conQuery("DELETE FROM likes WHERE idUser = ? AND idPost = ? LIMIT 1", [req.session.user.id, idPost]);
            if(deleteLike){
                return res.json({status: 201});
            }

            return res.json({status: 200});
        }
    }
}

module.exports = {commentPage, deleteComment, like, deslike};