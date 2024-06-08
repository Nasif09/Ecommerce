const{ Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require('../secrect');


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minlength: [3, 'the length will be gretter than 3'],
        maxlength: [30, 'the length will be less than 30'],
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v){
                return /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
            },
            message: 'please enter a valid email'
        },
    }, 
    password: {
        type: String,
        required: [true, 'User password is required'],
        minlength: [6, 'the length will be gretter than 6'],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
        type: String,
        default: defaultImagePath,
    //     type: Buffer,
    //     contentType: String,
    //     required: [true, 'Image is required'],
     },
    address: {
        type: String,
        required: [true, 'User address is required'],
    },
    phone: {
        type: String,
        required: [true, 'User phone no is required'],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },    
}, { timestamps: true });


const User = model('Users',userSchema);
module.exports = User;