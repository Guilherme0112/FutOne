const { configDotenv } = require('dotenv');
var con = require('../database/db_connection');
const { promisify } = require('util');
const conQuery = promisify(con.query).bind(con);
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Página de verificação de e-mail
const verifyEmailGET = async(req, res) => {
    const token = req.params.token;

    const verifyToken = await conQuery("SELECT * FROM autenticacao WHERE token = ?", [token]);

    if(verifyToken.length === 0 || token.length === 0){
        return res.redirect('/register');
    }
    
    return res.render('verifyEmail', { token, erro: '' });
}

// Verifica se o codigo que o usuario digitou está correto
const verifyEmailPOST = async(req, res) => {
    // console.log(req.body);
    const token = req.body.token;
    const code = req.body.code;

    const codeVerify = await conQuery("SELECT * FROM autenticacao WHERE codigo = ? AND token = ?", [code, token]);

    if(codeVerify.length === 0){
        return res.render('verifyEmail', {erro: "Código Inválido", token})
        
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if(err) throw err;

        con.query("INSERT INTO users VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?, DEFAULT)", [decoded.nomeToken, decoded.emailToken, decoded.senhaToken, decoded.bioToken], (err, response) => {
            if(err) throw err;
        })
    })

    const deleteToken = await conQuery("DELETE FROM autenticacao  WHERE codigo = ? AND token = ?", [code, token])

    if(deleteToken){
        return res.redirect('/login');
    }

    res.redirect(`/verifyEmail/${token}`);
}

// Função de envio de e-mails
async function emailVerify(email, code) {
    const nodemailer = require('nodemailer');
    require('dotenv').config();
  
    try {

      // Cria um transportador SMTP

        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verificação de Conta',
            html: `<h1>Código de verificação</h1><br><h3>${code}</h3>`
        };

        // Envio assíncrono do email

        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado:', info.response);
        return true;
        
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return false;
    }
  }


module.exports = { verifyEmailGET, verifyEmailPOST, emailVerify };