var express = require('express');
var app = express();
const multer = require('multer');
const router = express.Router();
const crypto = require('crypto');

// Controllers
const PerfilController = require('../controllers/PerfilController');
const EditarPerfilController = require('../controllers/EditarPerfilController');

// Middleware
const isAuth = require('../middleware/authMiddleware');

router.get('/', isAuth.isAuth, PerfilController.perfil);

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

router.get('/editar', isAuth.isAuth, EditarPerfilController.editarPerfilGET);
router.get('/editar/you', isAuth.isAuth, EditarPerfilController.editarPerfilPOST);
router.post('/editar/you', isAuth.isAuth, uploadPerfil.single('img'), EditarPerfilController.editarPerfilPOST);

router.post('/deletarConta', isAuth.isAuth, EditarPerfilController.delConta);
router.post('/deletarContaCriador', isAuth.isAuth, EditarPerfilController.delContaCriador);

router.get('/criar', isAuth.isAuth, PerfilController.criadorGET);
router.post('/criar', isAuth.isAuth, PerfilController.criadorPOST);

module.exports = router;