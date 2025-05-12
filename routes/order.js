const express = require("express");
const orderRouter = express.Router();

const Order = require('../models/order');
//Post route for creating orders
orderRouter.post('/api/orders', async (req, res) => {
    try {
        const {fullName, 
            email,
            state, 
            city,
            locality, 
            productName, 
            productPrice, 
            quantity, 
            category, 
            image,
            vendorId, 
            buyerId,              
        } = req.body;
        const createdAt = new Date().getMilliseconds(); //  Get the current date
        // Created new order instance with the extracated fields
        const newOrder = new Order({
            fullName, 
            email,
            state, 
            city,
            locality,
            productName, 
            productPrice,
            quantity,
            category,
            image, 
            vendorId,
            buyerId,
            createdAt
        });
        await newOrder.save();
        return res.status(201).send(newOrder);
        
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});
 
//Get route for fetching all orders by buyerId
orderRouter.get('/api/orders/:buyerId', async (req, res) => {
    try {
        // extract buyerId from request parameters
        const buyerId = req.params.buyerId;
        // Find all orders in the database with the matching buyerId
        const orders = await Order.find({buyerId});
        // If no orders are found, return a 404 error with a message
        if (orders.length === 0) {
            return res.status(404).json({message: 'No orders found for this buyer'});
        }
        // If orders are found, return them with a 200 status code
        res.status(200).json(orders);
    } catch (e) {
        // Handle any errors that occur during the order retrieval process
        res.status(500).json({error: e.message});
    }
});

module.exports = orderRouter;
