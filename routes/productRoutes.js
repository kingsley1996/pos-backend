const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const upload = require('../middlewares/upload'); // Middleware để xử lý upload ảnh

// Route lấy danh sách product
router.get('/', ProductController.getProducts);

// Route tạo product
router.post('/', upload.single('image'), ProductController.createProduct);

// Route cập nhật product
router.put('/:id', upload.single('image'), ProductController.updateProduct);

// Route xóa product
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
