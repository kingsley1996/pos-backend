// controllers/tableController.js

const Table = require("../models/Table");

// Thêm bàn mới
exports.createTable = async (req, res) => {
    try {
        const { tableNumber, orderNumber, status } = req.body;
        const newTable = new Table({ tableNumber, orderNumber, status });
        await newTable.save();
        res.status(201).json(newTable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy danh sách tất cả các bàn
exports.getTables = async (req, res) => {
    try {
        const tables = await Table.find();
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin một bàn theo ID
exports.getTableById = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if (!table) return res.status(404).json({ message: "Table not found" });
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin bàn
exports.updateTable = async (req, res) => {
    try {
        const { tableNumber, orderNumber, status } = req.body;
        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { tableNumber, orderNumber, status },
            { new: true }
        );
        if (!table) return res.status(404).json({ message: "Table not found" });
        res.status(200).json(table);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa một bàn
exports.deleteTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.id);
        if (!table) return res.status(404).json({ message: "Table not found" });
        res.status(200).json({ message: "Table deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
