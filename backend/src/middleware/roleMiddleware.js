const db = require("../config/db");

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const userId = req.user.id;

        db.query(
            "SELECT role FROM users WHERE id = ?",
            [userId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "DB error" });
                }

                if (result.length === 0) {
                    return res.status(404).json({ message: "User not found" });
                }

                const userRole = result[0].role;

                if (!roles.includes(userRole)) {
                    return res.status(403).json({
                        message: "Access denied"
                    });
                }

                next();
            }
        );
    };
};

module.exports = roleMiddleware;