const express = require('express');
const Product = require('../models/product');
const {auth, vendorAuth} = require('../middleware/auth'); // import the authentication middleware
const productRouter = express.Router();

productRouter.post('/api/add-product', auth, vendorAuth,async (req, res) => {
    try {
        const {productName, productPrice,quantity,description, category,vendorId, fullName, subCategory,images} = req.body;
        const product = new Product({
            productName,
            productPrice,
            quantity,
            description, 
            category, 
            vendorId, 
            fullName, 
            subCategory,
            images
        });
        await product.save();
        return res.status(201).json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


productRouter.get('/api/popular-products', async (req, res) => {
    try {
        const popularProducts = await Product.find({popular: true});
        if(!popularProducts || popularProducts.length ==0){
            return res.status(400).json({message: 'No products found'});
        }
        return res.status(200).json(popularProducts);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

productRouter.get('/api/recommended-products', async (req, res) => {
    try {
        const recommendedProducts = await Product.find({recommend: true});
        if(!recommendedProducts || recommendedProducts.length ==0){
            return res.status(400).json({message: 'No products found'});
        }
        return res.status(200).json({recommendedProducts: recommendedProducts});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

// New route for retrieving products by category
productRouter.get('/api/products-by-category/:category', async(req, res) =>{
    try {
        const {category} = req.params;
        const products = await Product.find({category, popular:true});
        if(!products || products.length == 0){
            return res.status(404).json({msg:"Product not found"});
        }else{
            return res.status(200).json(products)
        }
    } catch (e) {
        res.status(500).json({error: e.message});
    }
})

//new route for retrieving products by subcategory
productRouter.get('/api/related-products-by-subcategory/:productId', async(req, res) =>{
    try {
        const {productId} = req.params;
        // first find the product to get its subcategory
        const product = await Product.findById(productId);
        if(!product || product.length == 0){
            return res.status(404).json({msg:"Product not found"});
        }else{
            //find related products by subcategory of the retrieved product
            const relatedProducts = await Product.find({
                subCategory: product.subCategory,
                 _id: {$ne: productId}
            }); // Exclude the current product
            if(!relatedProducts || relatedProducts.length == 0){
                return res.status(404).json({msg:"No related products found"});
            }
            return res.status(200).json(relatedProducts)
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
})

// route for retrieving the top 10 highest rated products
productRouter.get('/api/top-rated-products', async(req, res) => {
    try {
        //fetch all products and sort them by average rating in descending order(highest rating first)
        const topRatedProducts = await Product.find({}).sort({averageRating: -1}).limit(10); // sort product by average rating in descending order
        // check if any products were found
        if(!topRatedProducts || topRatedProducts.length == 0){
            return res.status(404).json({msg:"No products found"});
        }else{
            //return the top rated products as a response
            return res.status(200).json(topRatedProducts)
        }
    } catch (e) {
        // handle any server errors that occur during the request
        return res.status(500).json({error: e.message});
    }
})


productRouter.get('/api/products-by-subCategory/:subCategory', async (req, res) => {
    try {
        const {subCategory} = req.params;
        const products = await Product.find({subCategory: subCategory});
        // check if any products were found
        if(!products || products.length == 0){
            return res.status(404).json({msg:"No products found in this subcategory"});
        }else{
            return res.status(200).json(products)
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
})

//Route for searching products by name or description
productRouter.get('/api/search-products', async (req, res) => {
    try {
        //extract the query parameter from the request
        const {query} = req.query;
        //validate that a query is provided
        //if missing, return a 400 status with an error message
        if(!query){
            return res.status(400).json({msg:"Please provide a search query"});
        }
        //search for products that match the query in either the product name or description
        //using a case-insensitive regex search
        const products = await Product.find({
            $or: [
                // Regex will match any product name or description that contains the query string
                // For example, if the query is "shoe", it will match "shoe", "Shoes", "Nike Shoes", etc.
                {productName: {$regex: query, $options: 'i'}},
                {description: {$regex: query, $options: 'i'}}
            ]
        });
        // check if any products were found, if not, return a 404 status with an error message
        if(!products || products.length == 0){
            return res.status(404).json({msg:"No products found"});
        }
        //if products were found, return them in the response with a 200 status
        else{
            return res.status(200).json(products)
        }
    }
    //catch any errors that occur during the request and return a 500 status with an error message
     catch (e) {
        return res.status(500).json({error: e.message});
    }
});


//Route to edit an existing product
productRouter.put('/api/edit-product/:productId', auth, vendorAuth, async (req, res) => {
    try {
        // Extract the productId from the request parameters and the updated product details from the request body
        const {productId} = req.params;
        const product = await Product.findById(productId);
        // Check if the product exists and if the vendor is authorized to edit it
        if(!product){
            return res.status(404).json({msg:"Product not found"});
        }
        if(product.vendorId.toString() !== req.user.id.toString()){
            return res.status(403).json({msg:"You are not authorized to edit this product"});
        }
        // Destructure the req.body to exclude vendorId
        const {vendorId, ...updatedProductDetails} = req.body;
        // Update the product with the new details
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            {$set: updatedProductDetails},// update only fields in the updateData
             {new: true}// return the updated product document in the response
            );
        // Return a success message with the updated product details
        return res.status(200).json(updatedProduct);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});
module.exports = productRouter;