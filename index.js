// App

var express = require('express');
var app = express();
var path = require('path')
var con = require('./database/db_connection');
var ejs = require('ejs');

// Sessões

var bcryptjs = require('bcryptjs');
const session = require('express-session');

const { runInNewContext } = require('vm');
const { default: isEmail } = require('validator/lib/isEmail');
var route = express.Router();
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

app.post('/login', function (req, res) {

    // Recebe os dados do formulário

    if (!req.body.email && !req.body.senha) {
        res.render('login', { erro: 'Preencha todos os campos.' })
    }

    var email = req.body.email;
    var senha = req.body.senha;

    // Fazz verificação do e-mail e se caso exista, ele verifica a senha que está criptografada

    con.query(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) throw err;
        if(user.length > 0){
            if (bcryptjs.compare(senha, user[0].senha)) {
                if (user.length > 0) {
                    req.session.user = {
                        id: user[0].id,
                        nome: user[0].nome,
                        email: user[0].email
                    }
                    // console.log(req.session.user);
                    res.redirect('/perfil');
                }
            }
        } else {
            res.render('login', { erro: 'As credenciais estão incorretas' });
        }
    })
});

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
                    con.query(`INSERT INTO users VALUES (DEFAULT, ?, ?, ?, DEFAULT)`, [nome, email, senhaHash], (err, resp) => {
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
        res.render('perfil', { user: dados });
    } else {
        res.redirect('/login');
    }
})

// Em alta

app.get('/alta', function(req, res) {
    res.render('alta');
})

// Porta do servidor

app.listen(8080, () => {
    console.log('Executando')
})