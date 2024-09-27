// App

var express = require('express');
var app = express();
const path = require('path');

// Sessões

const session = require('express-session');
app.use(session({
    secret: '214365',
    resave: false,
    saveUninitialized: false
}))

app.use(express.static('public'));

// Configurações

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.json());

// Sessões

app.use(express.urlencoded({ extended: false }));

// Rotas
const router = express.Router();

const indexRota = require('./routes/main');
const authRota = require('./routes/auth');
const postRota = require('./routes/post');
const usersRota = require('./routes/users');
const adminRota = require('./routes/admin');

// Início
app.use('/', indexRota);

// Autenticação
app.use('/', authRota);

// Postagens
app.use('/post', postRota);

// Perfil
app.use('/perfil', usersRota);

// Adiministração
app.use('/admin', adminRota);
// Em alta
app.get('/alta', function(req, res) {
    res.render('alta');
})

// Fallback
app.get('*', (req, res) => {
    return res.render('404')
})

// Porta do servidor
app.listen(8080, () => {
    console.log('Executando')
});

module.exports = router;