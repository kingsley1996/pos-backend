const Category = require('../models/Category');

// Tạo mới category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create category', error: error.message });
    }
};

// Hàm cập nhật category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Cập nhật dữ liệu mới
        category.name = name || category.name;
        category.description = description || category.description;

        await category.save();

        res.json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error('Error updating category:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Lấy danh sách category
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get categories', error: error.message });
    }
};

// Xóa category theo ID
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error: error.message });
    }
};
