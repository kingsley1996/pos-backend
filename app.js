const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tableRoutes = require('./routes/tableRoutes');

dotenv.config();
connectDB();

const app = express();

// Set up CORS to allow multiple origins
app.use(cors({
    origin: ['https://ug-pos.netlify.app', 'http://localhost:5174'],
    credentials: true, // Allow cookies if necessary
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tables', tableRoutes);

module.exports = app;
