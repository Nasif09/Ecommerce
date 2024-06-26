const{ Schema, model } = require('mongoose');
const {defaultImagePath} = require('../secrect');

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'product name is required'],
        trim: true,
        unique: true,
        minlength: [3, 'the length will at least 3 charecter'],
    },
    slug: {
        type: String,
        required: [true, 'product slug is required'],
        lowerCase: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        trim: true,
        minlength: [3, 'description length will at least 3 charecter'],
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
        trim: true,
        validate:{
            validator: (v) => v > 0,
            message: (props)=>
                `${props.value} is not a valid Price. 
                Price must be greater than zero.`,
        }
    },
    quantity: {
        type: Number,
        required: [true, 'product quantity is required'],
        trim: true,
        validate:{
            validator: (v) => v > 0,
            message: (props)=>
                `${props.value} is not a valid Quantity. 
                Quantity must be greater than zero.`,
        }
    },
    sold: {
        type: Number,
        required: [true, 'sold quantity is required'],
        trim: true,
        default: 0,
    },
    shipping:{
        type: Number,
        default: 0,//shipping free or paid
    },
    image: {
        type: String,
        default: defaultImagePath,
        // type: Buffer,
        // contentType: String,
        // required: [true, 'Product Image is required'],
     },
     category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
     }
  
}, 
{ timestamps: true }
);


const Product= model('Product',productSchema);
module.exports = Product;