const slugify = require('slugify')

const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { createCategory, getCategory, getCategories, updateCategory, deleteCategory } = require('../services/categoryService');

const handleCreateCategory = async(req, res, next) => {
    try{
        const { name } = req.body;

        const newCategory = await createCategory(name);

        return successResponse(res,{
            statusCode: 201,
            message: `category created`,
            payload: newCategory,
        })
    }catch(error){
        next(error);
    }
}

const handleGetCategories = async(req, res, next) => {
    try{
        const Categories = await getCategories();

        return successResponse(res,{
            statusCode: 200,
            message: `category fetches successfully`,
            payload: Categories,
        })
    }catch(error){
        next(error);
    }
}

const handleGetCategory = async(req, res, next) => {
    try{
        const { slug } = req.params;
        const Category = await getCategory(slug);

        if(!Category){
            throw createHttpError(404, 'no category found with this slug');
        }

        return successResponse(res,{
            statusCode: 200,
            message: `category fetches successfully`,
            payload: Category,
        })
    }catch(error){
        next(error);
    }
}
const handleUpdateCategory = async(req, res, next) => {
    try{
        const { slug } = req.params;
        const { name } = req.body;
        const updatedCategory = await updateCategory(name,slug);

        if(!updatedCategory){
            throw createHttpError(404, 'no categoryfound with this slug');
        }
        return successResponse(res,{
            statusCode: 200,
            message: `category updated successfully`,
            payload: updatedCategory,
        })
    }catch(error){
        next(error);
    }
}

const handleDeleteCategory = async(req, res, next) => {
    try{
        const { slug } = req.params;
        const result = await deleteCategory(slug);

        if(!result){
            throw createHttpError(404, 'no categoryfound with this slug');
        }
        return successResponse(res,{
            statusCode: 200,
            message: `category deleted successfully`,
        })
    }catch(error){
        next(error);
    }
}

module.exports = { 
    handleCreateCategory,
    handleGetCategories,
    handleGetCategory,
    handleUpdateCategory,
    handleDeleteCategory
 };