// controllers/cargoTypeController.js
const CargoType = require('../models/CargoType');

// Lấy danh sách tất cả loại hàng hóa
exports.getCargoTypes = async (req, res) => {
    try {
        const cargoTypes = await CargoType.find();
        res.json(cargoTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get cargo types' });
    }
};

// Thêm loại hàng hóa mới
exports.createCargoType = async (req, res) => {
    try {
        const { name, description } = req.body;

        const cargoType = new CargoType({
            name,
            description,
        });

        await cargoType.save();
        res.status(201).json(cargoType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create cargo type' });
    }
};

// Cập nhật loại hàng hóa
exports.updateCargoType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const cargoType = await CargoType.findById(id);
        if (!cargoType) {
            return res.status(404).json({ message: 'Cargo type not found' });
        }

        cargoType.name = name || cargoType.name;
        cargoType.description = description || cargoType.description;

        await cargoType.save();
        res.json({ message: 'Cargo type updated successfully', cargoType });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update cargo type' });
    }
};

// Xóa loại hàng hóa
exports.deleteCargoType = async (req, res) => {
    try {
        const { id } = req.params;

        const cargoType = await CargoType.findById(id);
        if (!cargoType) {
            return res.status(404).json({ message: 'Cargo type not found' });
        }

        await cargoType.deleteOne();
        res.json({ message: 'Cargo type deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete cargo type' });
    }
};
