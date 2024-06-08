const express = require('express');
const { runValidation } = require('../validators');
const { handleLogin, handleLogOut } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');
const { validateUserLogin } = require('../validators/auth');

const authRouter = express.Router();

authRouter.post('/login',validateUserLogin,runValidation, isLoggedOut , handleLogin)
authRouter.post('/logOut',isLoggedIn, handleLogOut)

module.exports = authRouter; 