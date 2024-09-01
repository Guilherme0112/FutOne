var express = require('express');
var app = express();
var path = require('path')
var con = require('./database/db_connection');
var ejs = require('ejs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const validator = require('validator')
const { runInNewContext } = require('vm');
const { default: isEmail } = require('validator/lib/isEmail');
var route = express.Router();
app.use(express.static('public'));

// Configurações

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// Rotas


// Início

app.get('/', function(req, res){
    con.query("SELECT * FROM postagens LIMIT 10", (err, dados) => {
        if(err){
            console.log("Erro: " + err);
        } else{
            // console.log(dados);
            con.query("SELECT * FROM postagens ORDER BY RAND() LIMIT 1", (err, post) => {
                if(err){
                    console.log('Erro: ' + err);
                } else {
                    res.render('index', {posts: dados, mains: post})
                }
            })
            
        }
    })
})

// Login

app.get('/login', function(req, res){
    res.render('login', {erro: ''});
});
app.post('/login', function(req, res){
    if(!req.body.email && !req.body.senha){
        res.render('login', {erro: 'Preencha todos os campos.'})
    }

    var email = req.body.email;
    var senha = req.body.senha;

    con.query(`SELECT COUNT(*) FROM users WHERE email = ? AND senha = ?`, [email, senha], (err, rows) => {
        if(err) throw err;
        // console.log(rows);
        if(rows[0]['COUNT(*)'] > 0){
            res.render('perfil');
        } else {
            res.render('login', {erro: 'As credenciais estão incorretas'});
        }
    })
});

// Registro

app.get('/register', function(req, res){
    res.render('register', {erro: ''});
});
app.post('/register', function(req, res){
    if(req.body.nome && req.body.email && req.body.senha && req.body.rsenha){
        if(req.body.senha != req.body.rsenha){
            res.render('register', {erro: 'As senhas não coencidem'})
        }
        var nome = req.body.nome;
        var email = req.body.email;
        var senha = req.body.senha;
        // console.log(req.body)
        if(nome.length < 2 || nome.length > 50){
            return res.render('register', {erro: 'O nome deve ter entre 3 e 50 caracteres'});
        }
        if (!isEmail(email)){
            return res.render('register', {erro: 'O e-mail é inválido'})
        }
        if (senha.length < 5 || senha.length > 16){
            return res.render('register', {erro: 'A senha deve ter entre 5 e 16 caracteres'})
        }
        con.query(`SELECT COUNT(*) FROM users WHERE email = '${email}'`, (err, resp) => {
            if(err){
                console.log('Erro: ' + err)
            } else {
                if(resp[0]['COUNT(*)'] > 0){
                    res.render('register', {erro: 'Já existe uma conta com este e-mail'});
                } else {
                    con.query(`INSERT INTO users VALUES (DEFAULT, ?, ?, ?, DEFAULT)`, [nome, email, senha], (err, resp) => {
                        if(err) {
                            console.log('Erro: ' + err)
                        } else {
                            res.render('login', {erro:''});
                        }
                    })
                }
            }
        })
        
    } else {
        res.render('register', {erro: ''});
    }
})

// Aba de exibição de posts

app.get('/post/:id', function(req, res) {
    var idPost = req.params.id;
    con.query("SELECT * FROM postagens WHERE id = ? LIMIT 1", [idPost], (err, dados) => {
        if(err){
            throw err;
        } else {
            res.render('post', {post: dados, title: dados.titulo});
        }
    });
});

// Páginas de perfil

app.get('/perfil', function(req, res) {
    res.render('perfil');
})

// Porta do servidor

app.listen(8080, () => {
    console.log('Executando')
})