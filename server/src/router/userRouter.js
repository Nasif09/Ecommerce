const express = require('express');
const { getUsers, getUserById, processRegister, activateUserAccount, handleManageUserStatusById, handleDeleteUserById, handleUpdateUserById, handleUpdatePassword, handleForgetPassword } = require('../controllers/userController');
const { validateUserRegistration, validateUserPasswordUpdate, validateUserForgetPassword } = require('../validators/auth');
const { runValidation } = require('../validators');
const upload = require('../middlewares/uploadFile');
const { isLoggedOut, isLoggedIn, isAdmin } = require('../middlewares/auth');
const userRouter = express.Router();


userRouter.post(
    '/process-register', 
    upload.single("image"),
    isLoggedOut,
    validateUserRegistration, 
    runValidation, 
    processRegister
);
userRouter.post('/activate',isLoggedOut, activateUserAccount);
userRouter.get('/',isLoggedIn, isAdmin, getUsers);
userRouter.get('/:id',isLoggedIn, getUserById);
userRouter.delete('/:id',isLoggedIn, handleDeleteUserById);
userRouter.put('/:id',
upload.single("image"),
isLoggedIn,
handleUpdateUserById);
userRouter.put('/update-password/:id',isLoggedIn,validateUserPasswordUpdate, runValidation, handleUpdatePassword );
userRouter.post('/forget-password', validateUserForgetPassword, runValidation, handleForgetPassword );
userRouter.put('/manage-user/:id',isLoggedIn, isAdmin, handleManageUserStatusById );

module.exports = userRouter; 