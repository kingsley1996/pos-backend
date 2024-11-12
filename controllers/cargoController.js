// controllers/cargoController.js
const Cargo = require('../models/Cargo');
const CargoType = require('../models/CargoType');
const Unit = require('../models/Unit');
const cloudinary = require('../utils/cloudinary');

// Lấy danh sách tất cả hàng hóa
exports.getCargos = async (req, res) => {
    try {
        const cargos = await Cargo.find().populate('cargoType', 'name').populate('unit', 'name');
        res.json(cargos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get cargos' });
    }
};

// Thêm hàng hóa mới
exports.createCargo = async (req, res) => {
    try {
        const { name, quantity, threshold, cargoTypeId, unitId } = req.body;

        // Kiểm tra loại hàng hóa có tồn tại không
        const cargoType = await CargoType.findById(cargoTypeId);
        const unit = await Unit.findById(unitId);
        if (!cargoType) {
            return res.status(404).json({ message: 'Cargo type not found' });
        }
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'cargos'
        });

        // Tạo cargo mới
        const cargo = new Cargo({
            name,
            quantity,
            threshold,
            // price,
            cargoType: cargoTypeId,
            unit: unitId,
            imageUrl: result.secure_url,
            imageId: result.public_id,
        });

        await cargo.save();
        res.status(201).json(cargo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create cargo' });
    }
};

// Cập nhật hàng hóa
exports.updateCargo = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, price, cargoTypeId } = req.body;

        // Kiểm tra hàng hóa có tồn tại không
        let cargo = await Cargo.findById(id);
        if (!cargo) {
            return res.status(404).json({ message: 'Cargo not found' });
        }

        // Kiểm tra loại hàng hóa có tồn tại không
        if (cargoTypeId) {
            const cargoType = await CargoType.findById(cargoTypeId);
            if (!cargoType) {
                return res.status(404).json({ message: 'Cargo type not found' });
            }
            cargo.cargoType = cargoTypeId;
        }

        // Cập nhật ảnh mới nếu có
        if (req.file) {
            // Xóa ảnh cũ trên Cloudinary
            await cloudinary.uploader.destroy(cargo.imageId);

            // Upload ảnh mới lên Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'cargos'
            });

            cargo.imageUrl = result.secure_url;
            cargo.imageId = result.public_id;
        }

        // Cập nhật các trường khác
        cargo.name = name || cargo.name;
        cargo.quantity = quantity || cargo.quantity;
        cargo.price = price || cargo.price;

        await cargo.save();
        res.json({ message: 'Cargo updated successfully', cargo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update cargo' });
    }
};

// Xóa hàng hóa
exports.deleteCargo = async (req, res) => {
    try {
        const { id } = req.params;

        const cargo = await Cargo.findById(id);
        if (!cargo) {
            return res.status(404).json({ message: 'Cargo not found' });
        }

        // Xóa ảnh trên Cloudinary
        await cloudinary.uploader.destroy(cargo.imageId);

        // Xóa cargo từ database
        await cargo.deleteOne();

        res.json({ message: 'Cargo deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete cargo' });
    }
};
