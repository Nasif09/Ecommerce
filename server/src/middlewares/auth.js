const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { jwtAccessKey } = require('../secrect');
const isLoggedIn = async(req, res, next) => {
    try{
        //console.log("IN", req.user);
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            throw createError(401, 'Access accessToken not found.Please login');
        }
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if(!decoded){
            throw createError(401, 'Invalid access accessToken. Please login again');
        }
        req.user = decoded.user;
        //console.log(decoded);
        next();
    }catch(error){
        return next(error);
    }
}

const isLoggedOut = async(req, res, next) => {
    try{
        const accessToken = req.cookies.accessaccessToken;
        if(accessToken){
            try{
                const decoded = jwt.verify(
                    accessToken,
                    jwtAccessKey
                );
                if(decoded){
                    throw createError(400, 'User already logedin');
                }
            }catch(error){
                throw error;
            } 
        }
        next();
    }catch(error){
        return next(error);
    }
}


const isAdmin = async(req, res, next) => {
    try{
        //console.log("Admin", req.user.isAdmin);
        if(!req.user.isAdmin){
            throw createError(403,'Forbidden. You must be an Admin')
        }
        next();
    }catch(error){
        return next(error);
    }
}


module.exports = {isLoggedIn, isLoggedOut, isAdmin }