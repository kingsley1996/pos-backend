const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../utils/cloudinary');

// Lấy danh sách tất cả sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name'); // Populate để lấy tên category
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get products' });
    }
};

// Thêm món ăn mới
exports.createProduct = async (req, res) => {
    try {
        const { name, price, categoryId } = req.body;

        // Kiểm tra category có tồn tại không
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products'
        });

        // Tạo product mới
        const product = new Product({
            name,
            price,
            category: categoryId,
            imageUrl: result.secure_url,
            imageId: result.public_id, // Lưu trữ imageId để xóa khi cần
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create product' });
    }
};

// Cập nhật product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, categoryId } = req.body;

        // Kiểm tra product có tồn tại không
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Kiểm tra category có tồn tại không
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            product.category = categoryId;
        }

        // Cập nhật ảnh mới nếu có
        if (req.file) {
            // Xóa ảnh cũ trên Cloudinary
            await cloudinary.uploader.destroy(product.imageId);

            // Upload ảnh mới lên Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products'
            });

            product.imageUrl = result.secure_url;
            product.imageId = result.public_id;
        }

        // Cập nhật các trường khác
        product.name = name || product.name;
        product.price = price || product.price;

        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

// Xóa product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Xóa ảnh trên Cloudinary
        await cloudinary.uploader.destroy(product.imageId);

        // Xóa product từ database
        await product.remove();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};
