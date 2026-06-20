const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // attach user data to request

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token invalid or expired"
        });
    }
};

module.exports = authMiddleware;