// App

var express = require('express');
var app = express();
var path = require('path')
var con = require('./database/db_connection');
var multer = require('multer');
var crypto = require('crypto');
const { cpf } = require('cpf-cnpj-validator');

// Sessões

var bcryptjs = require('bcryptjs');
const session = require('express-session');
const moment = require('moment');
require('dotenv').config;

const { runInNewContext } = require('vm');
const { promisify } = require('util');
const { default: isEmail } = require('validator/lib/isEmail');
const { name } = require('ejs');
var route = express.Router();
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

// Rotas

// Início

app.get('/', function (req, res) {
    con.query("SELECT * FROM postagens LIMIT 10", (err, dados) => {
        if (err) {
            console.log("Erro: " + err);
        } else {
            // console.log(dados);
            con.query("SELECT * FROM postagens ORDER BY RAND() LIMIT 1", (err, post) => {
                if (err) {
                    console.log('Erro: ' + err);
                } else {
                    res.render('index', { posts: dados, mains: post, sessao: req.session.user });
                }
            })

        }
    })
})

// Login

// GET

app.get('/login', function (req, res) {
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.render('login', { erro: '' });
    }
});

// POST
app.post('/login', async (req, res) => {

    // Recebe os dados do formulário

    if (!req.body.email && !req.body.senha) {
        res.render('login', { erro: 'Preencha todos os campos.' })
    }

    var email = req.body.email;
    var senha = req.body.senha;

    // Fazz verificação do e-mail e se caso exista, ele verifica a senha que está criptografada
    
    var user = await conQuery(`SELECT * FROM users WHERE email = ?`, [email]);
        if(user.length > 0){    
            var verifySenha = await bcryptjs.compare(senha, user[0].senha);
            // console.log(verifySenha);
            // console.log(typeof senha, senha);
            // console.log(typeof user[0].senha,  user[0].senha);

            if (verifySenha) {
                req.session.user = {
                    id: user[0].id,
                    nome: user[0].nome,
                    email: user[0].email,
                    foto: user[0].foto,
                    bio: user[0].bio
                }
                // console.log(req.session.user);
                res.redirect('/perfil');
            } else{
                res.render('login', { erro: 'As credenciais estão incorretas' });
            }
        } else {
            res.render('login', { erro: 'As credenciais estão incorretas' });
        }
    })

// Registro
// GET
app.get('/register', function (req, res) {
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.render('register', { erro: '' });
    }
});

// POST

app.post('/register', async (req, res) => {

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
        // console.log(typeof senha, salt, senha);
        senhaHash = await bcryptjs.hash(senha, salt);
        con.query(`SELECT COUNT(*) FROM users WHERE email = '${email}'`, (err, resp) => {
            if (err) {
                console.log('Erro: ' + err)
            } else {
                if (resp[0]['COUNT(*)'] > 0) {
                    res.render('register', { erro: 'Já existe uma conta com este e-mail' });
                } else {
                    con.query(`INSERT INTO users VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?, DEFAULT)`, [nome, email, senhaHash, bio], (err, resp) => {
                        if (err) {
                            console.log('Erro: ' + err)
                        } else {
                            res.render('login', { erro: '' });
                        }
                    })
                }
            }
        })

    } else {
        res.render('register', { erro: '' });
    }
})

// Aba de exibição de posts

app.get('/post/:id', function (req, res) {
    var idPost = req.params.id;
    con.query("SELECT * FROM postagens WHERE id = ? LIMIT 1", [idPost], (err, dados) => {
        if (err) {
            throw err;
        } else {
            res.render('post', { post: dados, title: dados.titulo });
        }
    });
});

// Logout

app.get('/logout', function (req, res) {
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
})

// Páginas de perfil

app.get('/perfil', function (req, res) {
    if (req.session.user) {
        var dados = req.session.user;

        con.query('SELECT * FROM criador WHERE idUser = ?', [req.session.user.id], (err, resp) => {
            if (err) throw err;
            // console.log(req.session.user)

            con.query("SELECT * FROM seguidores WHERE idSeguindo = ?", [req.session.user.id], (err, seguidores) => {
                if (err) throw err;
                // console.log(seguidores, seguidores.length)
                con.query("SELECT * FROM postagens WHERE idUsuario = ?", [req.session.user.id], (err, postagens) => {
                    if(err) throw err;

                    res.render('perfil', { user: dados, resp, seguidor: seguidores.length, posts: postagens});
                })
            })
            
        });
    } else {
        res.redirect('/login');
    }
})

// Em alta

app.get('/alta', function(req, res) {
    res.render('alta');
})

// Criar postagem

app.get('/criar', function(req, res){
    if(req.session.user){
        con.query('SELECT * FROM criador WHERE idUser = ?', [req.session.user.id], (err, resp) => {
            if(resp.length > 0){
                res.render('criar', {erro: ''});
            } else {
                res.redirect('/');
            }
        })
    } else {
        res.redirect('/');
    }
});

// Receber o arquivo de imagem e salvar na pasta

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        var nameArquivo = crypto.randomBytes(16).toString('hex');
        var extencao = file.originalname.split('.').pop();

        cb(null, nameArquivo + '.' + extencao);
    }
});
const upload = multer({ storage });
app.post('/criar', upload.single('foto'), function(req, res){
    // console.log(req.body);
    // console.log(req.file);
});

// Formulário para ser noticiário
// GET

app.get('/criar/perfil', function(req, res) {
    if(req.session.user){
        con.query('SELECT * FROM criador WHERE idUser = ?', [req.session.user.id], (err, resp) => {
            // console.log(resp)
            if(resp.length > 0){
                res.redirect('/');
            } else {
                res.render('criarPerfil', {erro: ''});
            }
        })
    } else {
        res.redirect('/');
    }
})

// POST

app.post('/criar/perfil', function(req, res){
    if(req.session.user){
        if(req.body.cpf && req.body.nasc && req.body.sexo){
            var cpfF = req.body.cpf;
            var nasc = req.body.nasc;
            var sexo = req.body.sexo;
            
            // Remoção de caracteres da máscara

            cpfF = cpfF.replace(/\D/g, '');

            console.log(cpfF)

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
            con.query('SELECT * FROM criador WHERE idUser = ?', [req.session.user.id], (err, resp) => {
                // console.log(resp.length)

                if(resp.length === 0){
                    con.query('INSERT INTO criador VALUES (DEFAULT, ?, ?, ?, ?, DEFAULT)', [cpfF, nasc, sexo, req.session.user.id], (err, resp) => {
                        if(err) throw err;
                        res.redirect('/perfil');
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            
            res.render('criarPerfil', {erro: 'Preencha os campos'});
        }
    } else {
        res.redirect('/');
    }
});

// Porta do servidor

app.listen(8080, () => {
    console.log('Executando')
})