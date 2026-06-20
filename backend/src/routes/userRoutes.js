const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

router.get("/profile", authMiddleware, (req, res) => {
    const userId = req.user.id;

    db.query(
        "SELECT id, name, email, created_at FROM users WHERE id = ?",
        [userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(result[0]);
        }
    );
});

module.exports = router;