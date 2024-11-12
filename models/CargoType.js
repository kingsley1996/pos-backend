// models/CargoType.js
const mongoose = require('mongoose');

const cargoTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model('CargoType', cargoTypeSchema);
