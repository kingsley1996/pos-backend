const Order = require('../models/Order');
const Table = require('../models/Table');

exports.createOrder = async (req, res) => {
    try {
        const { tableId, products, totalPrice } = req.body;
        const table = await Table.findById(tableId);
        if (!table || table.status !== 'available') {
            return res.status(400).json({ message: "Table is not available" });
        }

        const order = new Order({ table: tableId, products, totalPrice });
        await order.save();

        // Cập nhật trạng thái bàn
        table.status = 'occupied';
        await table.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
