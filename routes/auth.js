const express = require('express');
const app = express();

const router = express.Router();
const EmailController = require('../controllers/EmailController');
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.loginGET);
router.post('/login', AuthController.loginPOST);

router.get('/register', AuthController.registerGET);
router.post('/register', AuthController.registerPOST);

router.get('/verifyEmail/:token', EmailController.verifyEmailGET);
router.post('/verifyEmail', EmailController.verifyEmailPOST);

router.get('/logout', AuthController.logout);

module.exports = router;