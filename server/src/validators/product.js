const { body } = require('express-validator');

const validateProduct = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Product Name is required')
    .isLength({ min: 3 })
    .withMessage('Product Name should be at least 3 charecters long'),
    
    body('description')
    .trim()
    .notEmpty()
    .withMessage('description Name is required')
    .isLength({ min: 3 })
    .withMessage('Description should be at least 3 charecters long'),
    
    body('price')
    .trim()
    .notEmpty()
    .withMessage('price is required')
    .isFloat(({ min: 0}))
    .withMessage('price must be a positive number'),
    
    body('category')
    .trim()
    .notEmpty()
    .withMessage('category is required'),
    
    body('quantity')
    .trim()
    .notEmpty()
    .withMessage('quantity is required')
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer'),

    body('image')
    .optional()
    .isString()
    .withMessage('Product image is optional'),
];


module.exports = {
    validateProduct, 
}