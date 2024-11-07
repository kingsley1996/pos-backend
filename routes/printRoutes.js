// routes/tableRoutes.js

const express = require("express");
const router = express.Router();
// const printController = require("../controllers/printer2");
const printerController = require("../controllers/printController");

// Endpoint thêm bàn mới
router.get("/", printerController.printReceipt);
module.exports = router;
