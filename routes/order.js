const express = require("express");
const orderRouter = express.Router();
const { auth, vendorAuth } = require('../middleware/auth');
const Order = require('../models/order');

// POST route to create a new order
orderRouter.post('/api/orders', auth, async (req, res) => {
  try {
    const {
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
    } = req.body;

    const createdAt = Date.now(); // Use proper timestamp
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
      createdAt,
    });

    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET route to fetch all orders by buyer ID
orderRouter.get('/api/orders/buyers/:buyerId', auth, async (req, res) => {
  try {
    const { buyerId } = req.params;
    const orders = await Order.find({ buyerId });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this buyer' });
    }

    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET route to fetch all orders by vendor ID
orderRouter.get('/api/orders/vendors/:vendorId', auth, vendorAuth, async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await Order.find({ vendorId });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this vendor' });
    }

    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE route to delete an order by order ID
orderRouter.delete('/api/orders/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH route to mark order as delivered
orderRouter.patch('/api/orders/:id/delivered', auth, vendorAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { delivered: true, processing: false },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH route to mark order as processing (not yet delivered)
orderRouter.patch('/api/orders/:id/processing', auth, vendorAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { processing: true, delivered: false },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET route to fetch all orders (admin/debug purpose)
orderRouter.get('/api/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = orderRouter;
