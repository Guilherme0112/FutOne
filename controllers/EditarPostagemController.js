var express = require('express');
var app = express();
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const fs = require('fs');
const { table } = require('console');
const { verify } = require('crypto');

const deletarPostagem = async (req, res) => {
    try{
    
        if(!req.body){
            return res.json({status: 404});
        }
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

const editarPostagemPOST = async (req, res) => {
    try{
        if(!req.session.user || !req.body){
            return res.redirect('/');
        }

        const userId = req.session.user.id;
        // Recebe os dados do formulário e atualiza a postagem
        const titulo = req.body.titulo;
        const assunto = req.body.assunto;
        const postId = req.body.id;

        // Verifica se a postagem existe
        const verifyPost = await conQuery("SELECT * FROM postagens WHERE id = ? AND idUsuario = ?", [postId, userId]);
        if(!verifyPost){
            return res.json({status: "Estamos com alguns problemas... Tente novamente mais tarde"})
        }

        // Recebe a imagem, atualiza no banco de dados e apaga a antiga imagem
        var imagem = "";
        if(req.file){
            imagem = 'uploads/posts/' + req.file.filename;

            // Verifica o tipo de imagem
            if(req.file.mimetype != 'image/png' && req.file.mimetype != 'image/jpg' && req.file.mimetype != 'image/jpeg' ){
                console.log('Apagado com sucesso');
                fs.unlinkSync('public/' + imagem);
                return res.json({status: "Somente PNG, JPEG e JPG são aceitos"});
            }
    
            const updateImg = await conQuery("UPDATE postagens SET foto = ? WHERE id = ?", [imagem, postId]);
            if(!updateImg){
                return res.json({status: "Erro ao atualizar imagem. Tente novamente mais tarde"})
            }
            fs.unlinkSync('public/' + verifyPost[0].foto);
        }

        // Validação

        const postVerify = await conQuery("SELECT * FROM postagens WHERE id = ? AND idUsuario = ?", [postId, userId]);
        if(!postVerify){
            return res.json({status: "Erro ao editar postagem. Tente novamente mais tarde"})
        }

        if(titulo.length < 3 || titulo.length > 100){
            if(imagem){
                fs.unlink('public/' + imagem, (err) => {
                    if(err) {
                        console.log(err)
                    };
                }); 
            }     
            console.log('Apagado com sucesso');
            return res.json({status: "O título deve ter entre 3 e 100 caracteres"});
        }
        
        if(assunto.length < 50 || assunto.length > 2000){
            if(imagem){
                fs.unlink('public/' + imagem, (err) => {
                    if(err) {
                        console.log(err)
                    };
                });  
            }    
            console.log('Apagado com sucesso');
            return res.json({status: "O assunto deve ter entre 50 e 2000 caracteres"});
        }

        // Caso passe nas validações, ele salva no banco de dados

        const updateTitulo = await conQuery("UPDATE postagens SET titulo = ? WHERE id = ?", [titulo, postId]);
        const updateAssunto = await conQuery("UPDATE postagens SET postagem = ? WHERE id = ?", [assunto, postId])
        if(!updateAssunto || !updateTitulo){
            return res.json({status: "Erro ao editar postagem. Tente novamente mais tarde"});
        }

        return res.json({status: 200});
    } catch(err){
        console.log(err);
        return res.json({status: "Ocorreu um erro interno. Tente novamente mais tarde"})
    }
}

module.exports = { deletarPostagem, editarPostagemPOST };