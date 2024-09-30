const con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const bcryptjs = require('bcryptjs');
const fs = require('fs');

const editarPerfilGET = async (req, res) => {
    try{
        var erro = "";
        const idUser = req.session.user.id;

        const user = await conQuery("SELECT * FROM users WHERE id = ? LIMIT 1", [idUser]);

        const criador = await conQuery("SELECT * FROM criador WHERE idUser = ?", [idUser]);

        if (user) {
            return res.render('editarPerfil', { user, criador, erro });
        }
        return res.redirect('/perfil');

    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
}

const editarPerfilPOST = async (req, res) => {
    try { 
        // console.log(req.body);
        
        const userSession = req.session.user;
        const nome = req.body.nome;
        const bio = req.body.bio;

        // Validação dos campos nome e bio

        if (nome.length < 3 || nome.length > 50) {
            return res.json({status: "O nome deve ter entre 3 e 50 caracteres"});
        }
        const sqlNome = await conQuery("UPDATE users SET nome = ? WHERE id = ?", [nome, userSession.id]);

        if (bio.length > 500) {
            return res.json({status: "A bio deve ter no máximo 500 caracteres"});
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
                return res.json({erro: "Somente são aceitos arquivos dos tipos PNG, JPEG e JPG"});
            }

            // Pega a antiga foto
            const verifyFoto = await conQuery("SELECT foto FROM users WHERE id = ?", [userSession.id]);

            // Atualiza a nova foto
            const sqlImg = await conQuery("UPDATE users SET foto = ? WHERE id = ?", [img, userSession.id]);

            if (!sqlImg) {
                fs.unlink('public/' + verifyFoto[0].foto, (err) => {
                    if (err) throw err;
                });

                
                return res.json({erro: "Erro ao trocar imagem. Tente novamente mais tarde"})
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

        return res.json({status: 200});

    } catch (error) {

        if(req.file){
            fs.unlink('public/uploads/perfil/' + req.file.filename, (err) => {
                if(err) throw err;
            })
        }
        console.log(error);
        return res.json({status: "Erro ao carregar imagem. Tente novamente mais tarde"})
    }
}

// Apagar conta principal

const delConta = async (req, res) => {
   
    const delConta = req.body.conta;
    const senha = req.body.senha;
    // console.log(req.body);

    try {
        const verifyUser = await conQuery("SELECT * FROM users WHERE id = ?", [req.session.user.id]);
        // console.log(verifyUser);
        if (verifyUser) {
            var verifySenha = await bcryptjs.compare(senha, verifyUser[0].senha);
            if (verifySenha) {

                const idUser = req.session.user.id;

                // Apaga os comentários, likes, deslikes do usuario

                const tabelas = ['likes', 'comentarios', 'criador'];

                for (var tabela of tabelas) {

                    var sqlDel = await conQuery("DELETE FROM " + tabela + " WHERE idUser = ?", [idUser]);
                }

                const conta = await conQuery("DELETE FROM users WHERE id = ? LIMIT 1", [idUser]);
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

                return res.json({ status: "A senha está incorreta" });
            }
        }
    } catch (error) {
        return res.json({ status: "Erro ao apagar a conta: " + error });
    }
}

const delContaCriador = async (req, res) => {
    try{
        if(!req.body.senha){
            return res.redirect('/perfil/editar');
        }

        const senha = req.body.senha;

        const verifyUser = await conQuery("SELECT * FROM users WHERE id = ?", [req.session.user.id]);
                // console.log(verifyUser);
        if (verifyUser) {
            var verifySenha = await bcryptjs.compare(senha, verifyUser[0].senha);
            if (!verifySenha) {
                return res.json({status: "A senha está incorreta"})
            }
        }

        const idUser = req.session.user.id;
        const verifyConta = await conQuery("SELECT * FROM criador WHERE idUser = ?", [idUser]);

        if(!verifyConta){
            return res.redirect('/');
        }

        // Pega id's dos posts que o usuário criou
        const idPosts = await conQuery("SELECT id, foto FROM postagens WHERE idUsuario = ?", [idUser]);


        // Apaga os likes e as postagens
        for(var idPost of idPosts){
            var delLikes = await conQuery("DELETE FROM likes WHERE idPost = ?", [idPost.id]);
            var delSeguidores = await conQuery("DELETE FROM seguidores WHERE idSeguidor = ?", [idUser]);
            var delComentarios = await conQuery("DELETE FROM comentarios WHERE idPost = ?", [idPost]);
            var delPost = await conQuery("DELETE FROM postagens WHERE id = ? LIMIT 1", [idPost.id]);
            fs.unlinkSync('public/' + idPost.foto)
        }

        const delContaCriadorSQL = await conQuery("DELETE FROM criador WHERE idUser = ? LIMIT 1", [idUser]);

        if(!delContaCriadorSQL){
            return res.json({erro: "Não foi possível apagar sua conta criador. Tente novamente mais tarde."});
        }

        return res.json({
            status: 200,
            redirect: '/perfil'
        });
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
}
module.exports = { editarPerfilGET, delConta, delContaCriador, editarPerfilPOST };