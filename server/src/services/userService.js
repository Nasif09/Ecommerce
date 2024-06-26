const mongoose = require('mongoose');
const createError = require("http-errors");
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const User = require("../models/userModel");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtResetPasswordKey, clientURL } = require('../secrect');
const emailWithNodeMailer = require('../helper/email');
const sendEmail = require('../helper/sendEmail');
const { publicIdWithoutExtensionFormUrl, deleteFileFromCloudinary } = require('../helper/cloudinaryHelper');
const cloudinary = require('cloudinary').v2;



const findUsers = async(search,limit,page) => {
    try{
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or:[
                { name: {$regex: searchRegExp } },
                { email: {$regex: searchRegExp } },
                { phone: {$regex: searchRegExp } },
            ]
        }
        const options = { password: 0 };

        const users = await User.find(filter, options)
        .limit(limit)
        .skip((page-1)*limit)

        const count = await User.find(filter).countDocuments();

        if(!users || users.length == 0 ) throw createError(404, 'no users found');

        return {
            users, 
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
            } 
        }
    }catch(error){
        throw error;
    }
}

const findUserById = async(id, options={}) => {
    try{
        const user = await User.findById(id, options);
        if(!user) {
            throw createError(404, 'no users found');
        }
        return user;
    }catch(error){
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'invalid id');
        }
        throw error;
    }
}
const deleteUserById = async(id, options={}) => {
    try{
        const existingUser = await User.findOne({_id:id});
        if(existingUser && existingUser.image){
            const publicId = await publicIdWithoutExtensionFormUrl(
                existingUser.image
            );
            deleteFileFromCloudinary('ecommerceMern/users',publicId, 'Users');
        }
        await User.findByIdAndDelete({_id: id, isAdmin: false});
        // if(user && user.image) {
        //     await deleteImage(user.image);
        // }
    }catch(error){
        throw error;
    }
}

const updateUserById = async(userId, req) => {
    try{
        const options = { password: 0 };
        const user = await findUserById(userId, options);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {};

        const allowedFields = ['name', 'password', 'phone', 'address'];
        for(const key in req.body){
            if(allowedFields.includes(key)){
                updates[key] = req.body[key];
            }else if(key == 'email'){
                throw createError(400, 'Email can not be updated');
            }
        }

        const image = req.file?.path;
        if(image){
            if(image.size > 1024*1024*20){
                throw createError(400, 'File too large. It must be less than 2MB');
            }
            const response = await cloudinary.uploader.upload(image,{
                folder: 'ecommerceMern/users',
            })
            updates.image = response.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updates, 
            updateOptions
        ).select("-password");

        if(!updatedUser){
            throw createError(404, 'User with this id does not exist');
        }

        //delte previous image from cloudinary
        if(user.image){
            const publicId = await publicIdWithoutExtensionFormUrl(user.image);
            await deleteFileFromCloudinary('ecommerceMern/users',
                publicId,
                'User'
            );
        }
        return updatedUser;
    }catch(error){
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'invalid id');
        }
        throw error;
    }
}
const updateUserPasswordById = async( email, userId, oldPassword, newPassword, confirnPassword ) => {
    try{
        const user = await User.findOne({email: email});

        //compare password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordMatch){
            throw createError(401, 'oldPassword and newPassword didnot match');
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: newPassword },
            { new: true }
        ).select('-password');

        if(!updatedUser) 
            { 
                throw createError(400, 'password not updated');
            }

        return updatedUser;
    }catch(error){
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'invalid id');
        }
        throw error;
    }
}
const forgetPasswordByEmail = async( email ) => {
    try{
        const userData = await User.findOne({email: email});

        if(!userData){
            throw createError(404, 'Email is incorrect or you have not verified your email address.Please register yourself first.');
        }

        //create jwt
        const token = createJSONWebToken(
            {email},
            jwtResetPasswordKey, 
            '10m'
        );

        //prepare email
        const emailData = {
            email,
            subject: 'Reset Password Email',
            html:`
            <h2>Hello ${userData.name}! </h2>
            <p>Please click here to <a href="${clientURL}/
            api/users/activate/${token}" target="_blank">
            Reset your password</a></p>
            `,
        }
        //send email with nodemailer
        sendEmail(emailData);
        return token;
    }catch(error){
        throw error;
    }
}

const resetPassword = async( token, password) => {
    try{
        const decoded = jwt.verify(token, jwtResetPasswordKey);

        if(!decoded){
            throw createError(400, 'Invalid or expired token');
        }

        const filter = { email: decoded.email };
        const update= { password: password};
        const options = {new: true };
        const updatedUser = await User.findOneAndUpdate(
            filter,
            update,
            options
        ).select('-password');

        if(!updatedUser) 
            { 
                throw createError(400, 'password reset failed');
            }
    }catch(error){
        throw error;
    }
}

const handleUserAction = async(userId, action) => {
    try{
        let update;
        let successMessage;
        if(action == 'ban'){
            update = { isBanned: true };
            successMessage = "User baned"
        }else if(action == 'unban'){
            update = { isBanned: false };
            successMessage = "User Unbaned"
        }else{
            throw createError(400, 'Invalid action use ban or unban');
        }
        
        const updateOptions = { new: true, runValidators: true, context: 'query' };

        //delete updates.email
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            update,
            updateOptions
        ).select("-password");

        if(!updatedUser){
            throw createError(400, 'User was not banned');
        }
        return successMessage;
    }catch(error){
        if(error instanceof mongoose.Error.CastError){
            throw createError(400, 'invalid id');
        }
        throw error;
    }
}

module.exports = {
    findUsers, 
    findUserById, 
    deleteUserById, 
    updateUserById, 
    updateUserPasswordById,
    forgetPasswordByEmail,
    resetPassword,
    handleUserAction}