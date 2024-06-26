const{ Schema, model } = require('mongoose');


const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'User Category name is required'],
        trim: true,
        unique: true,
        minlength: [3, 'the length will at least 3 charecter'],
    },
    slug: {
        type: String,
        required: [true, 'User Category slug is required'],
        lowerCase: true,
        unique: true,
    },
  
}, 
{ timestamps: true }
);


const Category= model('Category',categorySchema);
module.exports = Category;