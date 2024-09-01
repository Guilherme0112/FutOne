var express = require('express');
var app = express();
var path = require('path')
var con = require('./database/db_connection');
var ejs = require('ejs');
var route = express.Router();
app.use(express.static('public'));

// config ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

app.get('/', function(req, res){
    con.query("SELECT * FROM postagens LIMIT 10", (err, dados) => {
        if(err){
            console.log("Erro: " + err);
        } else{
            // console.log(dados);
            res.render('index', {posts: dados})
        }
    })
})

// Login e Registro

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});

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


app.listen(8080, () => {
    console.log('Executando')
})