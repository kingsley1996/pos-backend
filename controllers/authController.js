const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        const user = new User({ name, username, password, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.log('error: ', error);
        res.status(400).json({ message: error.message });
    }
};

exports.verify = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false });

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(401).json({ valid: false });
        }
        res.json({ valid: true });
    });
}