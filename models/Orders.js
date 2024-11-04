const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
