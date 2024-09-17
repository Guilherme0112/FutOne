var express = require('express');
var app = express();
const session = require('express-session');
var con = require('../database/db_connection');
var bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const { default: isEmail } = require('validator/lib/isEmail');
const verifyEmail = require('./EmailController');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');

app.use(session({
    secret: '214365',
    resave: false,
    saveUninitialized: false
}))

// GET

const loginGET = async (req, res) => {

    // Verifica se o usuário ta autenticado

    if (req.session.user) {
        res.redirect('/')
    } else {
        res.render('login', { erro: '' });
    }
}

// POST

const loginPOST = async (req, res) => {

    // Recebe os dados do formulário

    if (!req.body.email && !req.body.senha) {
        res.render('login', { erro: 'Preencha todos os campos.' })
    }

    var email = req.body.email;
    var senha = req.body.senha;

    // Faz verificação do e-mail e se caso exista, ele verifica a senha que está criptografada
    
    var user = await conQuery(`SELECT * FROM users WHERE email = ?`, [email]);
    
    if(user.length > 0){    
        var verifySenha = await bcryptjs.compare(senha, user[0].senha);

        if (verifySenha) {

            // Cria a sessão

            req.session.user = {
                id: user[0].id,
            }

            // console.log(req.session.user);
            res.redirect('/perfil');
        } else{
            res.render('login', { erro: 'As credenciais estão incorretas' });
        }
    } else {
        res.render('login', { erro: 'As credenciais estão incorretas' });
    }
}

// GET

const registerGET = async (req, res) => {
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.render('register', { erro: '' });
    }
}

// POST

const registerPOST = async (req, res) => {
    
    // Recebe os dados e valida

    if (req.body.nome && req.body.email && req.body.senha && req.body.rsenha) {
        if (req.body.senha != req.body.rsenha) {
            res.render('register', { erro: 'As senhas não coencidem' })
        }

        var nome = req.body.nome;
        var email = req.body.email;
        var senha = req.body.senha;
        var bio = req.body.bio;

        // console.log(req.body)

        if (nome.length < 2 || nome.length > 50) {
            return res.render('register', { erro: 'O nome deve ter entre 3 e 50 caracteres' });
        }
        if (!isEmail(email)) {
            return res.render('register', { erro: 'O e-mail é inválido' })
        }
        if (senha.length < 5 || senha.length > 16) {
            return res.render('register', { erro: 'A senha deve ter entre 5 e 16 caracteres' })
        }

        // Faz a criptografia da senha e salva no banco

        const salt = await bcryptjs.genSalt(10);
        senhaHash = await bcryptjs.hash(senha, salt);

        const countEmail = await conQuery('SELECT COUNT(*) FROM users WHERE email = ?', [email]);
        if (!countEmail) {
            return res.render('register', {erro: "Erro ao conferir e-mail"});
        } 

        if (countEmail[0]['COUNT(*)'] > 0) {
            return res.render('register', { erro: 'Já existe uma conta com este e-mail' });
        }
        
        const userAutenticacao = {
            nomeToken: nome,
            emailToken: email,
            senhaToken: senhaHash,
            bioToken: bio
        }

        const token = jwt.sign(userAutenticacao, process.env.JWT_KEY, {expiresIn: '300s'});
        const code = crypto.randomBytes(3).toString('hex');

        console.log(code);

        const sqlToken = await conQuery("INSERT INTO autenticacao VALUE (DEFAULT, ?, ?, DEFAULT)", [token, code]);
        if(!sqlToken){
            return res.render('register', {erro: "Erro ao gerar token de validação"})
        }


        var verificaçãoDoEmail = verifyEmail.emailVerify(email, code);
        if(!verificaçãoDoEmail){
            return res.render('register', {erro: "Erro ao mandar o código para seu e-mail"})
        }

        res.redirect(`/verifyEmail/${token}`);

    } else {
        res.render('register', { erro: '' });
    }
}

// Logout

const logout = async (req, res) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                console.log('Erro: ' + err);
            } else {
                res.clearCookie('connect.sid');
                res.redirect('/login');
            }
        })
    } else {
        res.redirect('/');
    }
}

module.exports = { loginGET, loginPOST, registerGET, registerPOST, logout }