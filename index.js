var express = require('express');
var app = express();
var path = require('path')
var con = require('./database/db_connection');
var ejs = require('ejs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { runInNewContext } = require('vm');
var route = express.Router();
app.use(express.static('public'));

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

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

// Login e Registro

app.get('/login', function(req, res){
    res.render('login', {erro: ''});
});
app.post('/login', function(req, res){
    if(!req.body.email && !req.body.senha){
        res.render('login', {erro: 'Preencha todos os campos.'})
    }

    var email = req.body.email;
    var senha = req.body.senha;

    con.query("SELECT COUNT(*) FROM users WHERE email = ? AND senha = ? LIMIT 1", [email, senha], (err, rows) => {
        if(err) throw err;
        if(rows > 0){
            res.render('perfil');
        } else {
            res.render('login', {erro: 'O usuário não está cadastrado'});
        }
    })
});

app.get('/register', function(req, res){
    res.render('register', {erro: ''});
});
app.post('/register', function(req, res){
    console.log(req.body);
    if(req.body.nome && req.body.email && req.body.senha && req.body.rsenha){
        if(req.body.senha != req.body.rsenha){
            res.render('register', {erro: 'As senhas não coencidem'})
        }
        var nome = req.body.nome;
        var email = req.body.email;
        var senha = req.body.senha;
        console.log(`Nome: ${nome}, E-mail: ${email}, Senha: ${senha}`)

    }

    res.render('register', {erro: ''});
})

// Aba de exibição de posts

app.get('/post/:id', function(req, res) {
    var idPost = req.params.id;
    con.query("SELECT * FROM postagens WHERE id = " + idPost + " LIMIT 1", (err, dados) => {
        if(err){
            throw err;
        } else {
            res.render('post', {post: dados, title: dados.titulo});
        }
    });
});

// Páginas de perfil

app.get('/perfil', function(req, res) {
    res.render('/perfil');
})
app.listen(8080, () => {
    console.log('Executando')
})