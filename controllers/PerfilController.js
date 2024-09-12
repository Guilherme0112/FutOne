const { cpf } = require('cpf-cnpj-validator');
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const moment = require('moment');

// Página de perfil

const perfil = async(req, res) => {

    // Verifica se o usuario está autenticado

    if (req.session.user) {
        var user = req.session.user;

        const perfil = await conQuery("SELECT * FROM users WHERE id = ?", [user.id]);

        // Verifica se é criador de conteúdo para exibir a opção de criar conteúdo
        const criador = await conQuery('SELECT * FROM criador WHERE idUser = ?', [user.id])
        
        // Retorna q quantidade de seguidores
        const seguidores = await conQuery("SELECT * FROM seguidores WHERE idSeguindo = ?", [user.id]);
        
        // Retorna a quantidade de postagens
        const posts = await conQuery("SELECT * FROM postagens WHERE idUsuario = ?", [user.id]);
        
        res.render('perfil', { user, criador, seguidores: seguidores.length, posts, perfil});
                        
    } else {
        res.redirect('/login');
    }
}

// Criar Perfil de criador
// GET

const criadorGET = async (req, res) => {
    if(req.session.user){
        const criador = await conQuery('SELECT * FROM criador WHERE idUser = ?', [req.session.user.id]);
        if(criador.length > 0){
            res.redirect('/');
        } else {
            res.render('criarPerfil', {erro: ''});
        }
    } else {
        res.redirect('/');
    }
}

// POST

const criadorPOST = async (req, res) => {
    if(req.session.user){
        if(req.body.cpf && req.body.nasc && req.body.sexo){
            var cpfF = req.body.cpf;
            var nasc = req.body.nasc;
            var sexo = req.body.sexo;
            
            // Remoção de caracteres da máscara

            cpfF = cpfF.replace(/\D/g, '');

            // console.log(cpfF)

            if(!cpf.isValid(cpfF) || cpfF.length < 11){
                return res.render('criarPerfil', {erro: 'CPF é inválido'});
            }
            const valData = moment(nasc, 'YYYY-MM-DD');

            if(!valData.isValid()){
                return res.render('criarPerfil', {erro: 'A data não é válida'})
            }
            if(new Date() < valData){
                return res.render('criarPerfil', {erro: 'A data deve ser menor que a atual'})
            }

            if(sexo === '0'){
                sexo = 'M';
            } else if (sexo === '1'){
                sexo = 'F';
            } else if (sexo === '2'){
                sexo = 'O';
            } else if (sexo === '3'){
                sexo = 'PND';
            } else {
                return res.render('criarPerfil', {erro: 'Sexo inválido'});
            }

            // Inserção dos dados após a validação

            const criador = await conQuery('SELECT * FROM criador WHERE idUser = ?', [req.session.user.id]);

            if(criador.length === 0){
                const sql = await conQuery('INSERT INTO criador VALUES (DEFAULT, ?, ?, ?, ?, DEFAULT)', [cpfF, nasc, sexo, req.session.user.id]);

                    if(!sql){
                        res.redirect('/');
                    }
                    res.redirect('/perfil');
            } else {
                res.redirect('/');
            }
        } else {
            
            res.render('criarPerfil', {erro: 'Preencha os campos'});
        }
    } else {
        res.redirect('/');
    }
}

module.exports = { perfil, criadorGET, criadorPOST };