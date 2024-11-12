// routes/cargoTypeRoutes.js
const express = require('express');
const router = express.Router();
const cargoTypeController = require('../controllers/cargoTypeController');

router.get('/', cargoTypeController.getCargoTypes);
router.post('/', cargoTypeController.createCargoType);
router.put('/:id', cargoTypeController.updateCargoType);
router.delete('/:id', cargoTypeController.deleteCargoType);

module.exports = router;
