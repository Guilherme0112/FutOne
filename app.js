// App

var express = require('express');
var app = express();
var path = require('path')
var con = require('./database/db_connection');
var multer = require('multer');
var crypto = require('crypto');
const { cpf } = require('cpf-cnpj-validator');
const fs = require('fs');

// Sessões

const session = require('express-session');

// Controllers


const { runInNewContext } = require('vm');
const { promisify } = require('util');
const { name } = require('ejs');
app.use(express.static('public'));

// Configurações

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
const conQuery = promisify(con.query).bind(con);
app.use(express.json());

// Sessões

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: '214365',
    resave: false,
    saveUninitialized: false
}))

// Controllers

const router = express.Router();
const indexController = require('./controllers/indexController');
const AuthController = require('./controllers/AuthController');
const PostsController = require('./controllers/PostsController');
const PerfilController = require('./controllers/PerfilController');

// Rotas
// Início

router.get('/', indexController.index);
app.use('/', router);

// Login

app.get('/login', AuthController.loginGET);
app.post('/login', AuthController.loginPOST)

// Registro

app.get('/register', AuthController.registerGET);
app.post('/register', AuthController.registerPOST);

// Logout

app.get('/logout', AuthController.logout);

// Aba de exibição de posts

app.get('/post/:id', PostsController.postagemPage);

// Páginas de perfil

app.get('/perfil', PerfilController.perfil);

// Em alta

app.get('/alta', function(req, res) {
    res.render('alta');
})

// Criar postagem

app.get('/criar', PostsController.criarPostagemGET);

// Receber o arquivo de imagem e salvar na pasta

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        var nameArquivo = crypto.randomBytes(16).toString('hex');
        var extencao = file.originalname.split('.').pop();

        cb(null, nameArquivo + '.' + extencao);
    },
    fileFilter: (req, file, cb) =>{
        const tiposDeImagem = ['image/jpg', 'image/png', 'image/jpeg'];
        if(tiposDeImagem.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(new Error('Somente JPEG, JPG e PNG são aceitos'))
        }
    }
});
const upload = multer({ storage });


// POST 

app.post('/criar', upload.single('foto'), PostsController.criarPostagemPOST);

// Formulário para ser noticiário
// GET

app.get('/criar/perfil', PerfilController.criadorGET);
app.post('/criar/perfil', PerfilController.criadorPOST);

// Porta do servidor

app.listen(8080, () => {
    console.log('Executando')
});

module.exports = router;