const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findById, checkUserExists } = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtActivationKey, clientURL, jwtResetPasswordKey } = require('../secrect');
const emailWithNodeMailer = require('../helper/email');
const { runValidation } = require('../validators');
const bcrypt = require('bcryptjs');
const { handleUserAction, findUsers, findUserById, deleteUserById, updateUserById, updateUserPasswordById, forgetPasswordByEmail } = require('../services/userService');



const getUsers = async(req, res, next) => {
    try{
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const {users, pagination} = await findUsers(search, limit, page);

        return successResponse(res,{
            statusCode: 200,
            message: 'users have been returned',
            payload: {
                users: users,
                pagination: pagination,
            }
        })
    }catch(error){
        next(error);
    }
}
const getUserById = async(req, res, next) => {
    try{
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findUserById( id, options);
        return successResponse(res,{
            statusCode: 200,
            message: 'user have been returned',
            payload: { user }
        })
    }catch(error){
        next(error);
    }
}
const handleDeleteUserById = async(req, res, next) => {
    try{
        const id = req.params.id;
        const options = {password: 0 };
        
        await deleteUserById(id, options);

        return successResponse(res,{
            statusCode: 200,
            message: 'user have been deleted',
        })
    }catch(error){
        next(error);
    }
}

const processRegister = async(req, res, next) => {
    try{
        const { name, email, password, phone, address } = req.body;

        const image = req.file?.path;
        if(image && image.size > 1024*1024*2*20){
            throw createError(400, 'File too large.It must be less than 2MB');
        }

        // if(!image){
        //     throw createError(400, 'Image file is required')
        // }
        // if(image.size > 2097152){
        //     throw createError(400, 'Image file too large.It must be less than 2MB')
        // }

        // const imageBufferString = image.buffer.toString('base64');

        const userExists = await checkUserExists(email);
        if(userExists){
            throw createError(
                409,
                'User with this email already exists. Please sign in'
            )
        }
        //create jwt
        const tokenPayload = { name, email, password, phone, address };

        if(image){
            tokenPayload.image = image;
        }
        const token = createJSONWebToken(
            tokenPayload, 
            jwtActivationKey, 
            '10m'
        );
        //prepare email
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html:`
            <h2>Hello ${name}! </h2>
            <p>Please click here to <a href="${clientURL}/api/users/activate/${token} target="_blank">activate your account</a></p>
            `
        }
        
        //send email with nodemailer
        try{
            await emailWithNodeMailer(emailData);
        }catch(error){
            next(createError(500, 'Failed to send verification email'));
            return ;
        }

        return successResponse(res,{
            statusCode: 200,
            message: `Please go to your ${email} for completing your registration`,
            payload:  token ,
        })
    }catch(error){
        next(error);
    }
}
const activateUserAccount = async(req, res, next) => {
    try{
        const token = req.body.token;
        console.log("token:::::", token);
        if(!token) throw createError(404, 'token not found');

        try{
            const decoded = jwt.verify(token,jwtActivationKey);
        if(!decoded) throw createError(401, 'user not verified');
        
        const userExists = await User.exists({email: decoded.email});
        if(userExists){
            throw createError(
                409,
                'User with this email already exists. Please sign in'
            )
        }

        await User.create(decoded);

        return successResponse(res,{
            statusCode: 201,
            message: `User was registered successfully`,
        })
        }catch(error){
            if(error.name == 'TokenExpiredError'){
                throw createError(401, 'TOken has expired');
            }else if(error.name == 'JsonWebTokenError'){
                throw createError(401, 'Invalid Token');
            }else{
                throw error;
            }
        }
    }catch(error){
        next(error);
    }
}

const handleUpdateUserById = async(req, res, next) => {
    try{
        const userId = req.params.id;
        const updatedUser = updateUserById(userId, req)
        return successResponse(res,{
            statusCode: 200,
            message: 'user has been updated',
            payload: updatedUser,
        })
    }catch(error){
        next(error);
    }
}
const handleUpdatePassword = async(req, res, next) => {
    try{
        const { email, oldPassword, newPassword, confirnPassword } = req.body;
        const userId = req.params.id;
        
        const updatedUser = await updateUserPasswordById( email, userId, oldPassword, newPassword, confirnPassword );
        return successResponse(res,{
            statusCode: 200,
            message: 'Password has been updated',
            payload: {updatedUser},
        })
    }catch(error){
        next(error);
    }
}
const handleForgetPassword = async(req, res, next) => {
    try{
        const {email} = req.body;

        const token = await forgetPasswordByEmail(email);

        return successResponse(res,{
            statusCode: 200,
            message: `Please go to your ${email} for reset your password`,
            payload: token ,
        })
    }catch(error){
        next(error);
    }
}

const handleManageUserStatusById = async(req, res, next) => {
    try{
        const userId = req.params.id;
        const action = req.body.action;

        const successMessage = await handleUserAction(userId, action);

        return successResponse(res,{
            statusCode: 200,
            message: successMessage,
        })
    }catch(error){
        next(error);
    }
}

module.exports = {
    getUsers, 
    getUserById, 
    handleDeleteUserById, 
    processRegister, 
    activateUserAccount, 
    handleUpdateUserById,
    handleManageUserStatusById,
    handleForgetPassword,
    handleUpdatePassword
 };