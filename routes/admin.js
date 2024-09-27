var express = require('express');
var app = express();
const router = express.Router();

const adminController = require('../controllers/AdminController');

// Página de administração
router.get('/', adminController.adminPage);

// Deletar conta
router.get('/deletar/conta', adminController.deletarContaCriadorAdmin);
router.post('/deletar/dConta', adminController.deletarContaAdmin);
router.post('/deletar/show', adminController.showConta);

// Banidos
router.get('/banidos', adminController.banidosGET);
router.post('/banidos', adminController.banidosPOST);

module.exports = router;