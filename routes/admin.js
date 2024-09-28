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
router.get('/deletar/conta', isAdmin.isAdmin, isAuth.isAuth, adminController.deletarContaCriadorAdmin);
router.post('/deletar/dConta', isAdmin.isAdmin, isAuth.isAuth, adminController.deletarContaAdmin);
router.post('/deletar/show', isAdmin.isAdmin, isAuth.isAuth, adminController.showConta);

// Banidos
router.get('/banidos', isAdmin.isAdmin, isAuth.isAuth, adminController.banidosGET);
router.post('/banidos', isAdmin.isAdmin, isAuth.isAuth, adminController.banidosPOST);

module.exports = router;