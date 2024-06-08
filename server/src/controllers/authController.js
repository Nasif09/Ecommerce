const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtAccessKey } = require('../secrect');


const handleLogin = async(req, res, next) => {
    try{
        //email, password req.body
        const { email, password } = req.body;
        //isExist
        const user = await User.findOne({email});
        if(!user){
            throw createError(404, 'User doesnot exist. Please register first');
        }
        //compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            throw createError(401, 'email or password didnot match');
        }
        //isBanned
        if(user.isBanned){
            throw createError(403, 'You are banned contact with authority');
        }
        //token,cookie
        //create jwt
        const accessToken = createJSONWebToken( 
            { user } ,
            jwtAccessKey, 
            '15m'
        );
        res.cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        const userWithoutPassword = await User.findOne({email}).select('-password');
        //suuccess res
        return successResponse(res,{
            statusCode: 200,
            message: 'User loged in successfully',
            payload:  { userWithoutPassword } ,
        });
    }catch(error){
        next(error)
    }
}
const handleLogOut = async(req, res, next) => {
    try{
        res.clearCookie('access_token');
        //suuccess res
        return successResponse(res,{
            statusCode: 200,
            message: 'User logOut successfully',
            payload:  { } ,
        });
    }catch(error){
        next(error)
    }
}


module.exports = { handleLogin, handleLogOut }