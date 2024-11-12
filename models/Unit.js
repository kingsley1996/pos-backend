// models/Unit.js
const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = mongoose.model("Unit", UnitSchema);
