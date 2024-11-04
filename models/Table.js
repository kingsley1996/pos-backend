const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    status: { type: String, enum: ['available', 'occupied'], default: 'available' }
});

module.exports = mongoose.model('Table', tableSchema);
