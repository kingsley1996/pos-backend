// routes/cargoRoutes.js
const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');
const upload = require('../middlewares/upload'); // middleware để xử lý file upload

router.get('/', cargoController.getCargos);
router.post('/', upload.single('image'), cargoController.createCargo);
router.put('/:id', upload.single('image'), cargoController.updateCargo);
router.delete('/:id', cargoController.deleteCargo);

module.exports = router;
