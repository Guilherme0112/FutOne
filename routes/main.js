var express = require('express');
var app = express();
const router = express.Router();
const IndexController = require('../controllers/IndexController');
const PostsGenerationController = require('../controllers/PostsGenerationController');
const ComentariosController = require('../controllers/ComentariosController');

// Início
router.get('/', IndexController.index);

// Comentários
router.post('/comentarioAdd', ComentariosController.commentPage);
router.post('/comentarioDel', ComentariosController.deleteComment);

// Likes
router.post('/like', ComentariosController.like);
router.post('/dislike', ComentariosController.deslike);

// Busca de dados para rolagem infinita
router.get('/load-data/page/:id', PostsGenerationController.generateIndex);

module.exports = router;