// controllers/unitController.js
const Unit = require("../models/Unit");

// Lấy danh sách các đơn vị đo lường
exports.getUnits = async (req, res) => {
    try {
        const units = await Unit.find();
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách đơn vị đo", error });
    }
};

// Thêm mới một đơn vị đo lường
exports.createUnit = async (req, res) => {
    const { name, description } = req.body;
    try {
        const unit = new Unit({ name, description });
        await unit.save();
        res.status(201).json(unit);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm đơn vị đo", error });
    }
};

// Cập nhật một đơn vị đo lường
exports.updateUnit = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedUnit = await Unit.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );
        if (!updatedUnit) {
            return res.status(404).json({ message: "Đơn vị đo không tồn tại" });
        }
        res.status(200).json(updatedUnit);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật đơn vị đo", error });
    }
};

// Xóa một đơn vị đo lường
exports.deleteUnit = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUnit = await Unit.findByIdAndDelete(id);
        if (!deletedUnit) {
            return res.status(404).json({ message: "Đơn vị đo không tồn tại" });
        }
        res.status(200).json({ message: "Đã xóa đơn vị đo thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa đơn vị đo", error });
    }
};
