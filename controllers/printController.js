const escpos = require('escpos');
const canvas = require('canvas');
escpos.Network = require('escpos-network');

// Địa chỉ IP của máy in
const printerIp = '192.168.1.240';

// Function to generate the receipt image using Canvas and convert it to PNG
async function generateReceiptImage(order) {
    const { createCanvas } = canvas;
    const width = 320;  // Adjust to your printer width (in pixels)
    const height = 400; // Adjust height based on content

    // Create a new canvas
    const img = createCanvas(width, height);
    const ctx = img.getContext('2d');

    // Set the background color
    ctx.fillStyle = '#fff';  // White background
    ctx.fillRect(0, 0, width, height);

    // Set the text style
    ctx.fillStyle = '#000'; // Black text
    ctx.font = '20px Arial'; // Font style and size

    // Write the receipt content
    ctx.textAlign = 'center';
    ctx.fillText('CỬA HÀNG XYZ', width / 2, 40);
    ctx.fillText('Địa chỉ: 123 Đường ABC, TP.HCM', width / 2, 70);
    ctx.fillText('-----------------------------------', width / 2, 100);
    ctx.fillText(`Đơn hàng: #${order.id}`, width / 2, 130);
    ctx.fillText(`Số lượng: ${order.quantity}`, width / 2, 160);
    ctx.fillText(`Thành tiền: ${order.total} đ`, width / 2, 190);
    ctx.fillText('-----------------------------------', width / 2, 220);
    ctx.fillText('Cảm ơn quý khách!', width / 2, 250);

    // Convert the canvas to a PNG image buffer
    const imageBuffer = img.toBuffer('image/png');

    return imageBuffer; // Return PNG buffer
}

// Print the receipt
const printReceipt = (req, res) => {
    const order = {
        id: 12345,
        quantity: 2,
        total: 100000
    }; // Sample order data

    // Generate the receipt image as PNG
    generateReceiptImage(order).then(imageBuffer => {
        const device = new escpos.Network(printerIp);
        const printer = new escpos.Printer(device);

        device.open(() => {
            // Create an escpos.Image from the PNG buffer
            const image = new escpos.Image(imageBuffer);

            // Print the image
            printer
                .align('CT') // Center align
                .image(image)
                .then(() => {
                    printer.cut() // Cut the paper
                    printer.close(); // Close the connection
                })// Send the PNG image buffer to the printer

            res.status(200).send('In hóa đơn thành công');
        });
    }).catch(err => {
        console.error('Error generating receipt image:', err);
        res.status(500).send('Lỗi khi in hóa đơn');
    });
};

module.exports = { printReceipt };
