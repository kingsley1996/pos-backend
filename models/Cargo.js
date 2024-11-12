// models/Cargo.js
const mongoose = require('mongoose');

const cargoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    threshold: {
        type: Number,
        required: true,
    },
    cargoType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CargoType',
        required: true,
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',  // Reference to the Unit model
        required: true,
    },
    imageUrl: String,
    imageId: String,
});

module.exports = mongoose.model('Cargo', cargoSchema);
