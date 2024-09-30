var express = require('express');
var app = express();
const router = express.Router();

const adminController = require('../controllers/AdminController');

// Middleware

const isAdmin = require('../middleware/adminMiddleware');
const isAuth = require('../middleware/authMiddleware');

// Página de administração
router.get('/', isAdmin.isAdmin, isAuth.isAuth, adminController.adminPage);

// Deletar conta
router.get('/conta/deletar', isAdmin.isAdmin, isAuth.isAuth, adminController.deletarContaCriadorAdmin);
router.post('/conta/deletar', isAdmin.isAdmin, isAuth.isAuth, adminController.deletarContaAdmin);
router.post('/deletar/show', isAdmin.isAdmin, isAuth.isAuth, adminController.showConta);

// Banidos
router.get('/banidos', isAdmin.isAdmin, isAuth.isAuth, adminController.banidosGET);
router.post('/banidos', isAdmin.isAdmin, isAuth.isAuth, adminController.banidosPOST);
router.post('/show/banidos', isAdmin.isAdmin, isAuth.isAuth, adminController.showBanidos);

// Deletar postagem
router.get('/postagem/deletar', isAdmin.isAdmin, isAuth.isAuth, adminController.delPostagem);
router.post('/postagem/deletar', isAdmin.isAdmin, isAuth.isAuth, adminController.delPostagemPOST);

// Denúncias
router.get('/denuncias', isAdmin.isAdmin, isAuth.isAuth, adminController.denuncias);
router.post('/denuncias', isAdmin.isAdmin, isAuth.isAuth, adminController.denunciasPOST);

module.exports = router;