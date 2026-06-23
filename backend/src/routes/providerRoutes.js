const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const db = require("../config/db");

// BEFORE (NOT GOOD)
// router.get("/provider-dashboard", ...)

// NOW (CLEAN STRUCTURE)
router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware(["provider"]),
    (req, res) => {
        res.json({ message: "Welcome provider" });
    }
);

router.get(
    "/common",
    authMiddleware,
    roleMiddleware(["user", "provider"]),
    (req, res) => {
        res.json({ message: "Common access" });
    }
);

// GET /api/provider/online-providers
// Provider dashboard presence: "online" = authenticated request within last 60 seconds
router.get(
    "/online-providers",
    authMiddleware,
    roleMiddleware(["provider", "user", "admin"]),
    (req, res) => {
        db.query(
            `
            SELECT id, name, last_seen, is_online
            FROM users
            WHERE role = 'provider'
              AND (is_online = 1 OR last_seen >= NOW() - INTERVAL 60 SECOND)
            ORDER BY is_online DESC, last_seen DESC
            `,
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                res.json(rows);
            }
        );
    }
);

// GET /api/provider/online-users
router.get(
    "/online-users",
    authMiddleware,
    roleMiddleware(["provider", "user", "admin"]),
    (req, res) => {
        db.query(
            `
            SELECT id, name, last_seen, is_online
            FROM users
            WHERE role = 'user'
              AND (is_online = 1 OR last_seen >= NOW() - INTERVAL 60 SECOND)
            ORDER BY is_online DESC, last_seen DESC
            `,
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                res.json(rows);
            }
        );
    }
);

module.exports = router;
