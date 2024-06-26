const slugify = require('slugify');
const Product = require('../models/productModel');
const createError = require('http-errors');
const {deleteImage} = require('../helper/deleteImage');
const { publicIdWithoutExtensionFormUrl, deleteFileFromCloudinary } = require('../helper/cloudinaryHelper');
const cloudinary = require('cloudinary').v2;

const createProduct = async(productData, image) => {
    if(image){
        const response = await cloudinary.uploader.upload(image,{
            folder: 'ecommerceMern/products',
        });
        productData.image = response.secure_url;
    }

    const productExists = await Product.exists({ name:productData.name });
    if(productExists){
        throw createError(
            409,
            'product with this name already exists.'
        )
    }
       
    //create product
    const product = await Product.create({
        ...productData, 
        slug: slugify(productData.name)
    })
    return product;
};

const getProducts = async( page=1, limit=4, filter={} ) => {
    const products = await Product.find(filter)
        .populate('category')
        .skip((page-1)* limit)
        .limit(limit)
        .sort({createAt: -1});

    if(!products){
        throw createError(404, 'no products found');
    }

    const count = await Product.find(filter)
        .countDocuments();

    return {
        products, 
        count,
        totalPages: Math.ceil(count/limit),
        currentPage: page,
    };
};

const updateProductBySlug = async(slug, req) => {
    try{
        const product = await Product.findOne({ slug: slug });
        if(!product){
            throw createError(404, 'Product not found');
        }

        const updateOptions = { new: true, runValidators: true, context: 'query'};
        let updates = {};

        const allowedFields = [
            'name',
            'description',
            'price',
            'solde',
            'quantity',
            'shipping',
        ];

        for(const key in req.body){
            if(allowedFields.includes(key)){
                if(key == 'name'){
                    updates.slug = slugify(req.body[key]);
                }
                updates[key] = req.body[key];
            }
        }

        const image = req.file?.path;
        if(image){
            if(image.size > 1024*1024*20){
                throw createError(400, 'File too large. It must be less than 2MB');
            }
            const response = await cloudinary.uploader.upload(image,{
                folder: 'ecommerceMern/products',
            })
            updates.image = response.secure_url;
        }

        const updateProduct = await Product.findOneAndUpdate(
            {slug},
            updates,
            updateOptions
        )
        if(!updateProduct){
            throw createError(404, 'updating product is not possible');
        }

        //delte previous image from cloudinary
        if(product.image){
            const publicId = await publicIdWithoutExtensionFormUrl(product.image);
            await deleteFileFromCloudinary('ecommerceMern/products',
                publicId,
                'Product'
            );
        }
        return updateProduct;
    }catch(error){
        throw error;
    }
};

const deleteProductBySlug = async(slug) => {
    try{
        const existingProduct = await Product.findOne({slug});

        if(!existingProduct){
            throw createError(404, 'no existingProducts found');
        }
        if(existingProduct.image){
            const publicId = await publicIdWithoutExtensionFormUrl(existingProduct.image);
            await deleteFileFromCloudinary('ecommerceMern/products',publicId, 'Product');
        }
         
        await Product.findOneAndDelete({slug});
    }catch(error){
        throw error;
    }
};

module.exports = {
    createProduct,
    getProducts,
    updateProductBySlug,
    deleteProductBySlug,
 };