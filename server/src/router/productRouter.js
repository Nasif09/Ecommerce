const express = require('express');

const { runValidation } = require('../validators');
const { isLoggedOut, isLoggedIn, isAdmin } = require('../middlewares/auth');
const { handleCreateProduct, handleGetProduct, handleDeleteProduct, handleUpdateProduct, handleGetProductById } = require('../controllers/productController');
const { validateProduct } = require('../validators/product');
const { uploadProductImage } = require('../middlewares/uploadFile');

const productRouter = express.Router();


productRouter.post(
    '/', 
    uploadProductImage.single("image"),
    validateProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleCreateProduct
);

productRouter.get(
    '/', 
    handleGetProduct
);
productRouter.get(
    '/:id([0-9a-fA-F]{24})', 
    handleGetProductById
);

productRouter.put(
    '/:slug', 
    uploadProductImage.single("image"),
    isLoggedIn,
    isAdmin,
    handleUpdateProduct
);

productRouter.delete(
    '/:slug', 
    isLoggedIn,
    isAdmin,
    handleDeleteProduct
);

module.exports = productRouter; 