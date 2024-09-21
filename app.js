// App

var express = require('express');
var app = express();
var path = require('path')
var multer = require('multer');
var crypto = require('crypto');

// Sessões

const session = require('express-session');
app.use(express.static('public'));

// Configurações

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
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
const IndexController = require('./controllers/IndexController');
const AuthController = require('./controllers/AuthController');
const PostsController = require('./controllers/PostsController');
const PerfilController = require('./controllers/PerfilController');
const PostsGenerationController = require('./controllers/PostsGenerationController');
const ComentariosController = require('./controllers/ComentariosController');
const EmailController = require('./controllers/EmailController');
const EditarPerfilController = require('./controllers/EditarPerfilController');

// Início

router.get('/', IndexController.index);
app.use('/', router);

// Autenticação

app.get('/login', AuthController.loginGET);
app.post('/login', AuthController.loginPOST);

app.get('/register', AuthController.registerGET);
app.post('/register', AuthController.registerPOST);

app.get('/verifyEmail/:token', EmailController.verifyEmailGET);
app.post('/verifyEmail', EmailController.verifyEmailPOST);

app.get('/logout', AuthController.logout);

// Aba de exibição de posts

app.get('/post/:id', PostsController.postagemPage);

app.post('/comentarioAdd', ComentariosController.commentPage);
app.post('/comentarioDel', ComentariosController.deleteComment);

app.post('/like', ComentariosController.like);
app.post('/dislike', ComentariosController.deslike);

// Páginas de perfil

app.get('/perfil', PerfilController.perfil);

// Receber o arquivo de imagem e salvar na pasta

const storagePerfil = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/perfil/');
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
const uploadPerfil = multer({ storage: storagePerfil });

app.get('/perfil/editar', EditarPerfilController.editarPerfilGET);
app.post('/perfil/editar', uploadPerfil.single('img'), EditarPerfilController.editarPerfilPOST);
app.post('/perfil/deletarConta', EditarPerfilController.delConta);
app.post('/perfil/deletarContaCriador', EditarPerfilController.delContaCriador);

// Em alta

app.get('/alta', function(req, res) {
    res.render('alta');
})

// Criar postagem

const storagePost = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/posts/');
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
const uploadPost = multer({ storage: storagePost });

app.get('/criar', PostsController.criarPostagemGET);
app.post('/criar', uploadPost.single('foto'), PostsController.criarPostagemPOST);

// Formulário para ser noticiário

app.get('/criar/perfil', PerfilController.criadorGET);
app.post('/criar/perfil', PerfilController.criadorPOST);

app.get('/load-data/page/:id', PostsGenerationController.generateIndex);

// Porta do servidor

app.listen(8080, () => {
    console.log('Executando')
});

module.exports = router;