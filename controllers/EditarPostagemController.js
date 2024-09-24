var express = require('express');
var app = express();
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const fs = require('fs');
const { table } = require('console');

const deletarPostagem = async (req, res) => {

    // Verificações
    if(!req.session.user){
        return res.redirect('/');
    }

    if(!req.body){
        return res.json({status: 404});
    }
    try{
        const userId = req.session.user.id;
        const postId = req.body.id;

        // Verifica se a postagem é do usuário
        const verifyPost = await conQuery("SELECT * FROM postagens WHERE id = ? AND idUsuario = ?", [postId, userId]);
        if(!verifyPost){
            return res.json({status: "Estamos com alguns problemas... Tente novamente mais tarde"})
        }

        // Deleta os dados do posts nestas tabelas e deleta a foto
        const tabelas = ["likes", "dislikes", "comentarios"];
        for(var tabela of tabelas){
            var sqlDel = await conQuery("DELETE FROM " + tabela + " WHERE idPost = ?", [postId]);
        }
        fs.unlink('public/' + verifyPost[0].foto, (err)=> {
            if(err) {
                console.log(err);
            }
        })        
        if(!sqlDel){
            return res.json({status: "Erro ao deletar postagem. Tente novamente mais tarde"})
        }
        
        // Deleta a postagem
        const delPost = await conQuery("DELETE FROM postagens WHERE id = ?", [postId]);
        if(!delPost){
            return res.json({status: "Erro ao deletar postagem. Tente novamente mais tarde"})
        }

        return res.json({status: 200});
    } catch (err) {
        console.log(err);
        return res.json({status: "Estamos tendo problemas agora. Tente novamente mais tarde"})
    }
}   

const editarPostagemGET = async (req, res) => {
    if(!req.session.user || !req.params.id){
        return res.redirect('/');
    }

    const postId = req.params.id;
    const userId = req.session.user.id;

    const sqlUser = await conQuery("SELECT * FROM users WHERE id = ?", [userId]);
    const sqlPost = await conQuery("SELECT * FROM postagens WHERE id = ? AND idUsuario = ?", [postId, userId]);
    if(!sqlPost){
        return redirect('/perfil');
    }

    return res.render('editarPost', {sqlPost, sqlUser});

}
const editarPostagemPOST = async (req, res) => {

}

module.exports = { deletarPostagem, editarPostagemGET, editarPostagemPOST };