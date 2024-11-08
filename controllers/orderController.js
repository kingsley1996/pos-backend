const Order = require('../models/Orders');
const Table = require('../models/Table');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

const generateOrderNumber = () => {
    return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(amount)
        .replace('₫', 'VND'); // Replace ₫ with 'VND' for compatibility with printers that don't support the symbol
};

// Function to remove Vietnamese tones
const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};

// Initialize printer settings
const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'tcp://192.168.1.240',
    options: {
        timeout: 5000
    },
    characterSet: 'SLOVENIA',
});

const printReceipt = async (order) => {
    console.log('Order:', order);
    printer.clear();

    // Header
    printer.alignCenter();
    printer.setTextSize(1, 1);
    printer.bold(true);
    printer.println(removeVietnameseTones("Cơm Tấm Út Ghiền"));
    printer.bold(false);
    printer.setTextSize(0, 0);
    printer.println("Phone: 0708554039");
    printer.drawLine();

    // Order details
    printer.alignLeft();
    printer.setTextSize(0, 0);
    printer.println(`Order Number: #${order.orderNumber}`);
    printer.println(`Table Number: ${order.table.tableNumber}`);
    printer.println(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    printer.drawLine();

    // Products list
    for (const item of order.products) {
        const productName = removeVietnameseTones(item.product.name);
        const productPrice = item.product.price;
        const quantity = item.quantity;
        const totalItemPrice = productPrice * quantity;

        printer.println(`${productName}`);
        printer.println(`${quantity} x ${formatCurrency(productPrice)} = ${formatCurrency(totalItemPrice)}`);
    }
    printer.drawLine();

    // Total Price
    printer.setTextSize(1, 0);
    printer.bold(true);
    printer.println(`Total: ${formatCurrency(order.totalPrice)}`);
    printer.bold(false);
    printer.newLine();

    // Footer
    printer.alignCenter();
    printer.cut();

    try {
        const isConnected = await printer.isPrinterConnected();
        if (isConnected) {
            await printer.execute();
            console.log("Receipt printed successfully!");
        } else {
            console.error("Printer not connected");
        }
    } catch (error) {
        console.error("Error printing receipt:", error);
    }
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

        // Populate table and product details
        const populatedOrder = await Order.findById(order._id)
            .populate({ path: 'table', select: 'tableNumber' })
            .populate({ path: 'products.product', select: 'name price' });

        // Update table status
        table.status = 'Vacant';
        await table.save();

        // Print receipt with populated data
        await printReceipt(populatedOrder);

        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({ path: 'table', select: 'tableNumber' })
            .populate({ path: 'products.product', select: 'name price' });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error getting orders:", error);
        res.status(400).json({ message: error.message });
    }
};
