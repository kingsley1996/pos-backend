const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route tạo mới category
router.post('/', categoryController.createCategory);

// Route lấy danh sách category
router.get('/', categoryController.getCategories);

// Route để cập nhật category
router.put('/:id', categoryController.updateCategory);

// Route xóa category theo ID
router.delete('/:id', categoryController.deleteCategory);


module.exports = router;
