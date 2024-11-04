const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.user = decoded;
        next();
    });
};
