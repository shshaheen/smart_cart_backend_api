const mongoose = require('mongoose');
const Category = require('./category');

const productSchema = mongoose.Schema({
    productName:{
        type: String,
        required: true,
        trim: true
    },
    productPrice:{
        type: Number,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true
    },
    vendorId:{
        type: String,
        required: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    subCategory:{
        type: String,
        required: true,
    },
    images:[
        {
            type: String,
            required: true  
        },
    ],
    popular: {
        type: Boolean,
        default: true
    },
    recommend:{
        type: Boolean,
        default: false
    },

    // Add thses fields for ratings
    averageRating:{
        type: Number,
        default: 0
    },
    totalRatings:{
        type: Number,
        default: 0
    },

});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;