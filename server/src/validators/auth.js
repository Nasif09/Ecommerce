const { body } = require('express-validator');

const validateUserRegistration = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 31 })
    .withMessage('Name should be at least 3-31 charecters long'),
    
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    //.matches()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 charecters long'),

    body('address')
    .trim()
    .notEmpty()
    .withMessage('address is required'),

    body('phone')
    .trim()
    .notEmpty()
    .withMessage('phone is required')
    .isLength({ min: 11, max: 11 })
    .withMessage('phone should be at least 11 charecters long'),

    body('image')
    .optional()
    .isString()
    .withMessage('User image is optional'),

    // body('image')
    // .custom((value, { req }) => {
    //     if(!req.file || !req.file.buffer){
    //         throw new Error('User image is required');
    //     }
    //     return true;
    // })
    // .withMessage('User image is required')
];

const validateUserLogin= [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    //.matches()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 charecters long'),
];

const validateUserPasswordUpdate = [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email'),

    body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('oldPassword is required')
    //.matches()
    .isLength({ min: 6 })
    .withMessage('oldPassword should be at least 6 charecters long'),

    body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('newPassword is required')
    .isLength({ min: 6 })
    .withMessage('newPassword should be at least 6 charecters long'),

    body('confirmPassword')
    .notEmpty()
    .withMessage('newPassword is required')
    .custom((value, {req}) => {
        if(value != req.body.newPassword){
            throw new Error("newPassword and oldPassword did not match")
        }
        return true;
    })
    .notEmpty()
    .withMessage('newPassword is required')
];


const validateUserForgetPassword = [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email'),
];


const validateResetPassword = [
    body('token')
    .trim()
    .notEmpty()
    .withMessage('token is required'),
    
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    //.matches()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 charecters long'),
];

module.exports = {
    validateUserRegistration, 
    validateUserLogin,
    validateUserForgetPassword,
    validateResetPassword,
    validateUserPasswordUpdate
}