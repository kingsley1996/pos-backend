const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: [true, "Table number is required"],
        unique: true
    },
    status: {
        type: String,
        enum: ["Vacant", "Occupied"],
        default: "Vacant"
    }
    // Các trường khác nếu có
});

module.exports = mongoose.model("Table", tableSchema);
