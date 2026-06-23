const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const db = require("../config/db");

// ── Auto-create tables on startup ────────────────────────────────────────────

db.query(`
    CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration_days INT NOT NULL DEFAULT 30,
        duration_months INT NOT NULL DEFAULT 1,
        tier_type ENUM('starter','premium','elite') NOT NULL DEFAULT 'premium',
        features TEXT,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    // If the table already exists, CREATE TABLE IF NOT EXISTS won't re-run the schema.
    // Unconditionally ensure the missing columns exist to prevent "Unknown column duration_months" errors.
    if (err) {
        console.error("packages table create error (continuing):", err.message);
    }

    db.query(
        "ALTER TABLE packages ADD COLUMN IF NOT EXISTS duration_months INT NOT NULL DEFAULT 1 AFTER duration_days",
        (alterErr) => {
            if (alterErr) console.error("Failed to ensure packages.duration_months:", alterErr.message);
        }
    );

    db.query(
        "ALTER TABLE packages ADD COLUMN IF NOT EXISTS tier_type VARCHAR(20) NOT NULL DEFAULT 'premium' AFTER duration_months",
        (alterErr) => {
            if (alterErr) console.error("Failed to ensure packages.tier_type:", alterErr.message);
        }
    );
});


// ── Users Summary ─────────────────────────────────────────────────────────────

router.get("/users-summary", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    db.query("SELECT COUNT(*) as totalUsers FROM users WHERE role = 'user'", (err, userCount) => {
        if (err) return res.status(500).json({ message: "Database error: " + err.message });
        db.query("SELECT COUNT(*) as totalProviders FROM users WHERE role = 'provider'", (err, providerCount) => {
            if (err) return res.status(500).json({ message: "Database error: " + err.message });
            db.query(
                "SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC",
                (err, users) => {
                    if (err) return res.status(500).json({ message: "Database error: " + err.message });
                    db.query(
                        "SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE role = 'provider' ORDER BY created_at DESC",
                        (err, providers) => {
                            if (err) return res.status(500).json({ message: "Database error: " + err.message });
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

// ── Packages (Public) ─────────────────────────────────────────────────────────

// GET /api/admin/packages/public  — no auth, used by MembershipPage
router.get("/packages/public", (req, res) => {
    db.query(
        "SELECT * FROM packages WHERE is_active = 1 ORDER BY FIELD(tier_type,'starter','premium','elite'), duration_months ASC",
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Database error: " + err.message });
            res.json(rows);
        }
    );
});

// GET /api/admin/packages  — admin only
router.get("/packages", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    db.query("SELECT * FROM packages ORDER BY FIELD(tier_type,'starter','premium','elite'), duration_months ASC, created_at DESC", (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error: " + err.message });
        res.json(rows);
    });
});

// POST /api/admin/packages
router.post("/packages", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    const { name, description, price, duration_days, duration_months, tier_type, features } = req.body;
    if (!name || price === undefined) return res.status(400).json({ message: "Name and price are required." });

    const dMonths = parseInt(duration_months) || 1;
    const dDays = parseInt(duration_days) || dMonths * 30;

    db.query(
        "INSERT INTO packages (name, description, price, duration_days, duration_months, tier_type, features) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, description || "", parseFloat(price), dDays, dMonths, tier_type || "premium", features || ""],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Database error: " + err.message });
            res.status(201).json({ id: result.insertId, name, description, price, duration_days: dDays, duration_months: dMonths, tier_type, features, is_active: 1 });
        }
    );
});

// DELETE /api/admin/packages/:id
router.delete("/packages/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    db.query("DELETE FROM packages WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Database error: " + err.message });
        res.json({ message: "Package deleted." });
    });
});

// PUT /api/admin/users/:id/toggle-active
router.put("/users/:id/toggle-active", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    const { id } = req.params;
    db.query("SELECT is_active FROM users WHERE id = ?", [id], (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error: " + err.message });
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });
        const newStatus = rows[0].is_active === 1 ? 0 : 1;
        db.query("UPDATE users SET is_active = ? WHERE id = ?", [newStatus, id], (err) => {
            if (err) return res.status(500).json({ message: "Database error: " + err.message });
            res.json({ message: "User status updated successfully", is_active: newStatus });
        });
    });
});

module.exports = router;

