const express = require('express');
const { runValidation } = require('../validators');
const { handleLogin, handleLogOut, handleRefreshToken, handleProtectedRoute } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');
const { validateUserLogin } = require('../validators/auth');

const authRouter = express.Router();

authRouter.post('/login',validateUserLogin, runValidation, isLoggedOut , handleLogin);
authRouter.post('/logOut',isLoggedIn, handleLogOut);
authRouter.get('/refresh-token', handleRefreshToken );
authRouter.get('/protected', handleProtectedRoute );

module.exports = authRouter; 