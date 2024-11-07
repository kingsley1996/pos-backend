// routes/tableRoutes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Endpoint thêm bàn mới
router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
module.exports = router;
