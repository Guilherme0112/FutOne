var express = require('express');
var app = express();
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);

const commentPage = async (req, res) => {
    if(req.session.user){
        const comentario = req.body.comment;
        const idUser = req.session.user.id;
        const idPost = req.body.idPost

        var verifyPost = await conQuery("SELECT * FROM postagens WHERE id = ?", [idPost]);
        // console.log(comentario, idUser, idPost);

        if(verifyPost){
            if(comentario.length > 0){
                var sql = await conQuery("INSERT INTO comentarios VALUES (DEFAULT, ?, ?, ?, DEFAULT)", [comentario, idUser, idPost]);
                if(!sql) throw err;
                var idComentarioRegistrado = sql.insertId;
                var comentarioSQL = await conQuery("SELECT users.id, users.nome, users.foto, comentarios.*, date_format(comentarios.criado, '%d/%m/%Y') FROM comentarios JOIN users ON users.id = comentarios.idUser WHERE comentarios.id = ?", [idComentarioRegistrado]);

                res.json({comentarioSQL});
            }
        } else {
            res.json({erro: "Erro ao enviar comentário"});
        }

    }
}

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

module.exports = {commentPage, deleteComment};