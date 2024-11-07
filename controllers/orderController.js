const Order = require('../models/Orders');
const Table = require('../models/Table');

const generateOrderNumber = () => {
    // Tạo một mã số ngẫu nhiên có độ dài 10 chữ số
    return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
};


exports.createOrder = async (req, res) => {
    try {
        const { tableId, products, totalPrice } = req.body;
        const table = await Table.findById(tableId);
        if (!table || table.status !== 'Vacant') {
            return res.status(400).json({ message: "Table is not available" });
        }

        const orderNumber = generateOrderNumber();

        const order = new Order({ table: tableId, products, totalPrice, status: 'completed', orderNumber });
        await order.save();

        // Cập nhật trạng thái bàn
        table.status = 'Vacant';
        await table.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        // Lấy tất cả các đơn hàng và populate thông tin liên quan
        const orders = await Order.find()
            .populate({
                path: 'table', // Thêm thông tin bàn liên quan đến đơn hàng
                select: 'tableNumber' // Chỉ lấy trường tableNumber của bàn
            })
            .populate({
                path: 'products.product', // Thêm thông tin sản phẩm cho mỗi món trong đơn hàng
                select: 'name price' // Chỉ lấy tên và giá của sản phẩm
            })
            .exec();
        // Nếu không có đơn hàng nào
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        // Trả về danh sách các đơn hàng với đầy đủ thông tin
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error getting orders:", error);
        res.status(400).json({ message: error.message });
    }
};
