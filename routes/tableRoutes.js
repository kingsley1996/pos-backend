// routes/tableRoutes.js

const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");

// Endpoint thêm bàn mới
router.post("/", tableController.createTable);

// Endpoint lấy danh sách tất cả các bàn
router.get("/", tableController.getTables);

// Endpoint lấy thông tin một bàn theo ID
router.get("/:id", tableController.getTableById);

// Endpoint cập nhật thông tin bàn
router.put("/:id", tableController.updateTable);

// Endpoint xóa một bàn
router.delete("/:id", tableController.deleteTable);

module.exports = router;
