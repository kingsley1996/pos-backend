// routes/unitRoutes.js
const express = require("express");
const unitController = require("../controllers/unitController");

const router = express.Router();

router.get("/", unitController.getUnits);        // Lấy danh sách đơn vị đo
router.post("/", unitController.createUnit);      // Thêm đơn vị đo mới
router.put("/:id", unitController.updateUnit);    // Cập nhật đơn vị đo theo ID
router.delete("/:id", unitController.deleteUnit); // Xóa đơn vị đo theo ID

module.exports = router;
