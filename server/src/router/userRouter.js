const express = require('express');
const { handleGetUsers, handleGetUserById, handleProcessRegister, handleActivateUserAccount, handleManageUserStatusById, handleDeleteUserById, handleUpdateUserById, handleUpdatePassword, handleForgetPassword, handleResettPassword, handleResetPassword } = require('../controllers/userController');
const { validateUserRegistration, validateUserPasswordUpdate, validateUserForgetPassword, validateResetPassword } = require('../validators/auth');
const { runValidation } = require('../validators');
const {uploadUserImage} = require('../middlewares/uploadFile');
const { isLoggedOut, isLoggedIn, isAdmin } = require('../middlewares/auth');
const userRouter = express.Router();


userRouter.post(
    '/process-register', 
    uploadUserImage.single("image"),
    isLoggedOut,
    validateUserRegistration, 
    runValidation, 
    handleProcessRegister
);
userRouter.get('/activate/:token',isLoggedOut, handleActivateUserAccount);
userRouter.get('/',isLoggedIn, isAdmin, handleGetUsers);
userRouter.get('/:id([0-9a-fA-F]{24})',isLoggedIn, handleGetUserById);
userRouter.delete('/:id',isLoggedIn, handleDeleteUserById);
userRouter.put('/reset-password', validateResetPassword, runValidation, handleResetPassword );
userRouter.put('/:id',
uploadUserImage.single("image"),
isLoggedIn,
handleUpdateUserById);
userRouter.put('/update-password/:id([0-9a-fA-F]{24})',isLoggedIn,validateUserPasswordUpdate, runValidation, handleUpdatePassword );
userRouter.post('/forget-password', validateUserForgetPassword, runValidation, handleForgetPassword );
userRouter.put('/manage-user/:id',isLoggedIn, isAdmin, handleManageUserStatusById );

module.exports = userRouter; 