const jwt = require("jsonwebtoken");
const db = require("../config/db");

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

        // ── Presence: update last_seen/is_online on every authenticated request ──
        if (req.user && req.user.id) {
            db.query(
                "UPDATE users SET last_seen = NOW(), is_online = 1 WHERE id = ?",
                [req.user.id],
                (err) => {
                    if (err) console.error("Failed to update presence:", err.message);
                }
            );
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token invalid or expired"
        });
    }
};

module.exports = authMiddleware;
