const express = require('express');
const { runValidation } = require('../validators');
const { isLoggedOut, isLoggedIn, isAdmin } = require('../middlewares/auth');
const { validateUserLogin } = require('../validators/auth');
const { handleCreateCategory, handleGetCategories, handleGetCategory, handleUpdateCategory, handleDeleteCategory } = require('../controllers/categoryController');
const { validateCategory } = require('../validators/category');

const categoryRouter = express.Router();

categoryRouter.post('/',validateCategory, runValidation, isLoggedIn ,isAdmin, handleCreateCategory);
categoryRouter.get('/', handleGetCategories);
categoryRouter.get('/:slug', handleGetCategory );
categoryRouter.put('/:slug',validateCategory, runValidation, isLoggedIn ,isAdmin, handleUpdateCategory );
categoryRouter.delete('/:slug',isLoggedIn ,isAdmin, handleDeleteCategory );

module.exports = categoryRouter; 