// Import the express module
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const cors = require('cors');
const bannerRouter = require('./routes/banner');
const categoryRouter = require('./routes/category');
const SubCategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter = require('./routes/product_review');
const vendorRouter = require('./routes/vendor');
const orderRouter = require('./routes/order');
// Defined the port number the server should listen on
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Create an instance of an express application because it give us the starting point
const app = express();


  
app.use(cors());

// This middleware function is executed for every request that comes into our server
app.use(express.json());
app.use(authRouter);   
app.use(bannerRouter); 
app.use(categoryRouter);
app.use(SubCategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(vendorRouter);
app.use(orderRouter);
// app.use(cors()); //enable CORS for all routes and origin(domain),

DB = process.env.MONGO_URI;
// console.log(DB);
mongoose.connect(DB).then(
    
    ()=>console.log("Connected to DB:", db.databaseName),).
    catch(error => console.error("MongoDB connection error: " + error));


//Start the server and listen on specified p    ort
app.listen(PORT, "0.0.0.0",function(){
    console.log(`Server is running on port http://localhost:${PORT}`);
});