const Order = require('../models/Orders');

exports.getRevenue = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Chuyển đổi startDate và endDate thành dạng Date
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Đặt endDate là cuối ngày

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end },
            status: 'completed'
        }).populate('products.product', 'name price');

        // Tính toán tổng doanh thu và số lượng đơn hàng
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrders = orders.length;
        const totalItemsSold = orders.reduce((sum, order) => {
            return sum + order.products.reduce((subSum, item) => subSum + item.quantity, 0);
        }, 0);

        res.json({
            totalRevenue,
            totalOrders,
            totalItemsSold
        });
    } catch (error) {
        console.error('Error calculating revenue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
