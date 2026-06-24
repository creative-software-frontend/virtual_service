const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const db = require("../config/db");

// USERS SUMMARY (UNCHANGED BUT SAFE)
router.get("/users-summary",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const [userCount] = await db.query(
                "SELECT COUNT(*) as totalUsers FROM users WHERE role='user'"
            );

            const [providerCount] = await db.query(
                "SELECT COUNT(*) as totalProviders FROM users WHERE role='provider'"
            );

            const [users] = await db.query(
                "SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE role='user' ORDER BY created_at DESC"
            );

            const [providers] = await db.query(
                "SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE role='provider' ORDER BY created_at DESC"
            );

            res.json({
                totalUsers: userCount[0].totalUsers,
                totalProviders: providerCount[0].totalProviders,
                users,
                providers
            });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// PACKAGES PUBLIC
router.get("/packages/public", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM packages WHERE is_active=1 ORDER BY FIELD(tier_type,'starter','premium','elite')"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PACKAGES ADMIN
router.get("/packages",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const [rows] = await db.query(
                "SELECT * FROM packages ORDER BY created_at DESC"
            );
            res.json(rows);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// CREATE PACKAGE
router.post("/packages",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const { name, description, price, duration_days, duration_months, tier_type, features } = req.body;

            const dMonths = parseInt(duration_months) || 1;
            const dDays = parseInt(duration_days) || dMonths * 30;

            const [result] = await db.query(
                `INSERT INTO packages
                (name, description, price, duration_days, duration_months, tier_type, features)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, description, price, dDays, dMonths, tier_type || "premium", features]
            );

            res.status(201).json({ id: result.insertId });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// DELETE PACKAGE
router.delete("/packages/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            await db.query("DELETE FROM packages WHERE id=?", [req.params.id]);
            res.json({ message: "Deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// TOGGLE USER ACTIVE
router.put("/users/:id/toggle-active",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const [rows] = await db.query("SELECT is_active FROM users WHERE id=?", [req.params.id]);
            if (!rows.length) return res.status(404).json({ message: "User not found" });

            const newStatus = rows[0].is_active ? 0 : 1;

            await db.query("UPDATE users SET is_active=? WHERE id=?", [
                newStatus,
                req.params.id
            ]);

            res.json({ is_active: newStatus });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;