const express = require('express');
// const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// Import các routes khác ở đây

dotenv.config();
connectDB();

const app = express();

// app.use(cors({
//     origin: 'http://localhost:5174', // Thay thế bằng URL frontend của bạn
//     credentials: true, // Nếu bạn cần gửi cookie trong yêu cầu
// }));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// Đăng ký các routes khác ở đây

module.exports = app;


