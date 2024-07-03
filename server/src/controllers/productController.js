const createError = require('http-errors');
const slugify = require("slugify");
const { successResponse } = require('./responseController');
const { findById } = require('../services/findItem');
const Product = require('../models/productModel');
const { createProduct, getProduct, getProducts, deleteProductBySlug, updateProductBySlug } = require('../services/productService');
const { find } = require('../models/userModel');


const handleCreateProduct = async(req, res, next) => {
    try{
        //const image = req.file;
        // if(!image){
        //     throw createError(400, 'Image file is required')
        // }
        // if(image.size > 1024*1024*20 ){
        //     throw createError(400, 'Image file too large.It must be less than 2MB')
        // 

        //const imageBufferString = image.buffer.toString('base64');

        
        const image = req.file?.path;
       
        const product = await createProduct(req.body,image);

        return successResponse(res,{
            statusCode: 200,
            message: `Product created`,
            payload:  {product} ,
        })
    }catch(error){
        next(error);
    }
}

const handleGetProduct = async(req, res, next) => {
    try{
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit  = parseInt(req.query.limit) || 4;

        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            isAdmin: { $ne: true },
            $or:[
                { name: {$regex: searchRegExp } },
            ]
        }

        const productsData = await getProducts(page,limit,filter);

        return successResponse(res,{
            statusCode: 200,
            message: `return all Product`,
            payload:  {
                products: productsData.products, 
                pagination: {
                    totalPages: productsData.totalPages,
                    currentPage: productsData.currentPage,
                    previousPage: productsData.currentPage-1,
                    nextPage: productsData.currentPage+1,
                    totalNumberOfProducts: productsData.count,
                }

            } ,
        })
    }catch(error){
        next(error);
    }
}

const handleGetProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        return successResponse(res, {
            statusCode: 200,
            message: 'Product has been returned',
            payload: product 
        });
    } catch (error) {
        next(error);
    }
};


const handleUpdateProduct = async(req, res, next) => {
    try{
        const { slug } = req.params;
        const updateProduct = await updateProductBySlug(slug, req);

        return successResponse(res,{
            statusCode: 200,
            message: 'Product has been updated',
            payload: updateProduct,
        })
    }catch(error){
        next(error);
    }
}

const handleDeleteProduct = async(req, res, next) => {
    try{
        const {slug} = req.params;
        await deleteProductBySlug(slug);

        return successResponse(res,{
            statusCode: 200,
            message: ` Product deleted`,
        })
    }catch(error){
        next(error);
    }
}

module.exports = {
    handleCreateProduct,
    handleGetProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleGetProductById
 };