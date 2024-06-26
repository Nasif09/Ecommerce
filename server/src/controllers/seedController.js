const data = require('../data');
const User = require('../models/userModel');
const Product = require('../models/productModel');


const seedUser = async(req, res, next) => {
    try{
        //deleting all existingg users
        await User.deleteMany({});

        //inserting new users
        const users = await User.insertMany(data.users);

        //successfulmessage
        return res.status(201).json(users);
    }catch(error){
        next(error);
    }
}

const seedProducts = async(req, res, next) => {
    try{
        //deleting all existingg users
        await Product.deleteMany({});

        //inserting new users
        const products = await Product.insertMany(data.products);

        //successfulmessage
        return res.status(201).json(products);
    }catch(error){
        next(error);
    }
}

module.exports = {seedUser, seedProducts};