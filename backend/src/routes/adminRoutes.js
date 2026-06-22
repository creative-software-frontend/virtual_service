const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const db = require("../config/db");

router.get("/users-summary", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    db.query("SELECT COUNT(*) as totalUsers FROM users WHERE role = 'user'", (err, userCount) => {
        if (err) { console.error("DB Error 1:", err); return res.status(500).json({ message: "Database error: " + err.message }); }

        db.query("SELECT COUNT(*) as totalProviders FROM users WHERE role = 'provider'", (err, providerCount) => {
            if (err) { console.error("DB Error 2:", err); return res.status(500).json({ message: "Database error: " + err.message }); }

            db.query(
                "SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC",
                (err, users) => {
                    if (err) { console.error("DB Error 3:", err); return res.status(500).json({ message: "Database error: " + err.message }); }

                    db.query(
                        "SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE role = 'provider' ORDER BY created_at DESC",
                        (err, providers) => {
                            if (err) { console.error("DB Error 4:", err); return res.status(500).json({ message: "Database error: " + err.message }); }

                            res.json({
                                totalUsers: userCount[0].totalUsers,
                                totalProviders: providerCount[0].totalProviders,
                                users,
                                providers
                            });
                        }
                    );
                }
            );
        });
    });
});

module.exports = router;