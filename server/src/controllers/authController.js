const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtAccessKey, jwtRefreshKey } = require('../secrect');
const { setAccessTokenCookie, setRefreshTokenCookie } = require('../helper/cookie');


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
            '5m'
        );
        setAccessTokenCookie(res, accessToken);

         //refresh token
         const refreshToken = createJSONWebToken( 
            { user } ,
            jwtRefreshKey, 
            '7d'
        );
        setRefreshTokenCookie(res, refreshToken);

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

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


const handleRefreshToken = async(req, res, next) => {
    try{
        const oldRefreshToken = req.cookies.refreshToken;

        //verify old refresh token
        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
        if(!decodedToken){
            throw createError(401, 'Invalid refresh token. please login again');
        }

        //token,cookie
        //create jwt
        const accessToken = createJSONWebToken( 
            decodedToken.user  ,
            jwtAccessKey, 
            '5m'
        );
        setAccessTokenCookie(res, accessToken);

        return successResponse(res,{
            statusCode: 200,
            message: 'New access token generated',
            payload:  { } ,
        });
    }catch(error){
        next(error)
    }
}

const handleProtectedRoute = async(req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken;

        //verify access token
        const decodedToken = jwt.verify(accessToken, jwtAccessKey);
        if(!decodedToken){
            throw createError(401, 'Invalid access token. please login again');
        }

        return successResponse(res,{
            statusCode: 200,
            message: 'Protected resources',
            payload:  { } ,
        });
    }catch(error){
        next("error")
    }
}

const handleLogOut = async(req, res, next) => {
    try{
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

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


module.exports = { 
    handleLogin,
    handleRefreshToken, 
    handleProtectedRoute,
    handleLogOut 
}