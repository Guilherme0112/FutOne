const con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const bcryptjs = require('bcryptjs');
const fs = require('fs');

const editarPerfilGET = async (req, res) => {
    if (req.session.user) {
        var erro = "";
        const idUser = req.session.user.id;

        const user = await conQuery("SELECT nome, email, foto, bio, criado FROM users WHERE id = ? LIMIT 1", [idUser]);

        if (user) {
            return res.render('editarPerfil', { user, erro });
        }
        return res.redirect('/perfil');
    }
    return res.redirect('/');
}

const editarPerfilPOST = async (req, res) => {
    try { 
        if (!req.session.user) {
            return res.redirect('/');
        }

        const user = await conQuery("SELECT nome, email, bio, criado FROM users WHERE id = ? LIMIT 1", [req.session.user.id]);

        const userSession = req.session.user;
        const nome = req.body.nome;
        const bio = req.body.bio;

        // Validação dos campos nome e bio

        if (nome.length < 3 || nome.length > 50) {
            return res.render('editarPerfil', { user, erro: "O nome deve ter entre 3 e 50 caracteres" });
        }
        const sqlNome = await conQuery("UPDATE users SET nome = ? WHERE id = ?", [nome, userSession.id]);

        if (bio.length > 500) {
            return res.render('editarPerfil', { user, erro: "A bio deve ter no máximo 500 caracteres" });
        }
        const sqlBio = await conQuery("UPDATE users SET bio = ? WHERE id = ?", [bio, userSession.id]);

        // Validação da imagem

        if (req.file) {

            // console.log(req.file)
            const img = 'uploads/perfil/' + req.file.filename;

            // Verifica o tipo de imagem 

            if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                fs.unlink('public/' + img, (err) => {
                    if (err) throw err;
                });
                return res.render("editarPerfil", { user, erro: "Somente são aceitas PNG, JPG e JPEG" });
            }

            // Pega a antiga foto
            const verifyFoto = await conQuery("SELECT foto FROM users WHERE id = ?", [userSession.id]);

            // Atualiza a nova foto
            const sqlImg = await conQuery("UPDATE users SET foto = ? WHERE id = ?", [img, userSession.id]);

            if (!sqlImg) {
                fs.unlink('public/' + verifyFoto[0].foto, (err) => {
                    if (err) throw err;
                });

                
                return res.render("editarPerfil", { user, erro: "Erro ao trocar imagem. Tente novamente mais tarde" });
            }
            
            // Verifica se é a foto padrão para so deletar caso for uma foto já adicionado pelo usuário
            if (verifyFoto[0].foto != "images/user.jpg") {
                fs.unlink('public/' + verifyFoto[0].foto, (err) => {
                    if(err){
                        console.log(err);
                    }
                    
                });
            }
        
        }

        return res.redirect('/perfil');
    } catch (error) {
        return res.render("editarPerfil", { user, erro: "Erro ao atualizar perfil. Tente novamente mais tarde" });
    }
}

const delConta = async (req, res) => {
    if (req.session.user) {
        const delConta = req.body.conta;
        const senha = req.body.senha;
        // console.log(req.body);

        // Verifica se é realmente para apagar a conta

        if (delConta === true) {
            try {
                const verifyUser = await conQuery("SELECT * FROM users WHERE id = ?", [req.session.user.id]);
                // console.log(verifyUser);
                if (verifyUser) {
                    var verifySenha = await bcryptjs.compare(senha, verifyUser[0].senha);
                    if (verifySenha) {

                        const idUser = req.session.user.id;

                        // Apaga os comentários, likes, deslikes do usuario

                        const tabelas = ['likes', 'dislikes', 'comentarios', 'criador'];

                        for (var tabela of tabelas) {

                            var sqlDel = await conQuery("DELETE FROM " + tabela + " WHERE idUser = ?", [idUser]);
                        }

                        const conta = await conQuery("DELETE FROM users WHERE id = ?", [idUser]);
                        const posts = await conQuery("DELETE FROM postagens WHERE idUsuario = ?", [idUser]);

                        // Destrói a sessão

                        req.session.destroy(async (err) => {
                            if (err) {
                                console.log(err)
                            }

                            return res.json({
                                status: 200,
                                redirect: '/login'
                            })

                        })
                    } else {

                        return res.json({ status: 250 });
                    }
                }
            } catch (error) {
                return res.json({ status: "Erro ao apagar a conta: " + error });
            }
        }
    }
}

module.exports = { editarPerfilGET, delConta, editarPerfilPOST };