var express = require('express');
var app = express();
const multer = require('multer');
const router = express.Router();

// Controllers
const PerfilController = require('../controllers/PerfilController');
const EditarPerfilController = require('../controllers/EditarPerfilController');

router.get('/', PerfilController.perfil);

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

router.get('/editar', EditarPerfilController.editarPerfilGET);
router.get('/editar/you', EditarPerfilController.editarPerfilPOST);
router.post('/editar/you', uploadPerfil.single('img'), EditarPerfilController.editarPerfilPOST);
router.post('/deletarConta', EditarPerfilController.delConta);
router.post('/deletarContaCriador', EditarPerfilController.delContaCriador);

router.get('/criar', PerfilController.criadorGET);
router.post('/criar', PerfilController.criadorPOST);

module.exports = router;