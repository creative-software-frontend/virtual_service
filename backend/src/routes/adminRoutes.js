const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const db = require("../config/db");

// ─── Helper: fetch packages with their normalized features ────────────────────
async function getPackagesWithFeatures(whereClause = '', params = []) {
    const [packages] = await db.query(
        `SELECT p.id, p.name, p.description, p.price, p.duration_days, p.duration_months,
                p.tier_type, p.is_active, p.type, p.created_at
         FROM packages p
         ${whereClause}
         ORDER BY p.created_at DESC`,
        params
    );

    if (!packages.length) return [];

    const packageIds = packages.map(p => p.id);
    const [featureRows] = await db.query(
        `SELECT pf.package_id, f.id AS feature_id, f.feature_key, f.display_name
         FROM package_features pf
         JOIN features f ON f.id = pf.feature_id
         WHERE pf.package_id IN (?)`,
        [packageIds]
    );

    // Group features by package_id
    const featureMap = {};
    for (const row of featureRows) {
        if (!featureMap[row.package_id]) featureMap[row.package_id] = [];
        featureMap[row.package_id].push({
            id: row.feature_id,
            key: row.feature_key,
            display_name: row.display_name,
        });
    }

    return packages.map(pkg => ({
        ...pkg,
        features: featureMap[pkg.id] || [],
    }));
}

// USERS SUMMARY
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

// PACKAGES PUBLIC — user-type only (for user MembershipPage, unchanged)
router.get("/packages/public", async (req, res) => {
    try {
        const packages = await getPackagesWithFeatures(
            "WHERE p.is_active=1 AND p.type='user'",
            []
        );
        // Sort by tier order for user packages
        const order = { starter: 0, premium: 1, elite: 2 };
        packages.sort((a, b) => {
            const sa = order[a.tier_type] ?? 99;
            const sb = order[b.tier_type] ?? 99;
            return sa !== sb ? sa - sb : Number(a.price) - Number(b.price);
        });
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PACKAGES ADMIN — all packages with features
router.get("/packages",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const packages = await getPackagesWithFeatures();
            res.json(packages);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// GET ALL FEATURES (for admin form)
router.get("/features",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const [rows] = await db.query(
                "SELECT id, feature_key, display_name FROM features ORDER BY display_name ASC"
            );
            res.json(rows);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// CREATE PACKAGE (normalized — accepts feature_ids array)
router.post("/packages",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const {
                name, description, price,
                duration_days, duration_months,
                tier_type, type,
                feature_ids,   // array of feature IDs (normalized)
                features,      // legacy CSV fallback (ignored for normalized path)
            } = req.body;

            const pkgType = type === 'provider' ? 'provider' : 'user';
            const dMonths = parseInt(duration_months) || 1;
            const dDays = parseInt(duration_days) || dMonths * 30;

            const [result] = await connection.query(
                `INSERT INTO packages
                 (name, description, price, duration_days, duration_months, tier_type, type, features)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    name,
                    description || null,
                    price,
                    dDays,
                    dMonths,
                    tier_type || 'premium',
                    pkgType,
                    features || null,   // keep CSV for legacy user membership status service
                ]
            );

            const packageId = result.insertId;

            // Insert normalized feature associations
            if (Array.isArray(feature_ids) && feature_ids.length > 0) {
                const values = feature_ids.map(fid => [packageId, parseInt(fid)]);
                await connection.query(
                    `INSERT IGNORE INTO package_features (package_id, feature_id) VALUES ?`,
                    [values]
                );
            }

            await connection.commit();
            res.status(201).json({ id: packageId });
        } catch (err) {
            await connection.rollback();
            res.status(500).json({ message: err.message });
        } finally {
            connection.release();
        }
    }
);

// UPDATE PACKAGE
router.put("/packages/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const {
                name, description, price,
                duration_days, duration_months,
                tier_type, type, is_active,
                feature_ids,
                features,
            } = req.body;

            const pkgType = type === 'provider' ? 'provider' : 'user';
            const dMonths = parseInt(duration_months) || 1;
            const dDays = parseInt(duration_days) || dMonths * 30;

            await connection.query(
                `UPDATE packages SET
                    name=?, description=?, price=?, duration_days=?, duration_months=?,
                    tier_type=?, type=?, features=?,
                    is_active=?
                 WHERE id=?`,
                [
                    name, description || null, price, dDays, dMonths,
                    tier_type || 'premium', pkgType, features || null,
                    is_active !== undefined ? is_active : 1,
                    req.params.id,
                ]
            );

            // Replace feature associations
            if (Array.isArray(feature_ids)) {
                await connection.query(
                    `DELETE FROM package_features WHERE package_id=?`,
                    [req.params.id]
                );
                if (feature_ids.length > 0) {
                    const values = feature_ids.map(fid => [parseInt(req.params.id), parseInt(fid)]);
                    await connection.query(
                        `INSERT IGNORE INTO package_features (package_id, feature_id) VALUES ?`,
                        [values]
                    );
                }
            }

            await connection.commit();
            res.json({ message: 'Updated', id: req.params.id });
        } catch (err) {
            await connection.rollback();
            res.status(500).json({ message: err.message });
        } finally {
            connection.release();
        }
    }
);

// DELETE PACKAGE
router.delete("/packages/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            // package_features cascade on package delete
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
            await db.query("UPDATE users SET is_active=? WHERE id=?", [newStatus, req.params.id]);
            res.json({ is_active: newStatus });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// GET /api/admin/reports
router.get("/reports",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
        try {
            const [depositRows] = await db.query(
                "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'deposit'"
            );
            const [withdrawRows] = await db.query(
                "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'withdraw'"
            );
            const [earningRows] = await db.query(
                "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type IN ('earning', 'event_income')"
            );
            const [userCountRows] = await db.query(
                "SELECT COUNT(*) AS total FROM users WHERE role = 'user'"
            );
            const [providerCountRows] = await db.query(
                "SELECT COUNT(*) AS total FROM users WHERE role = 'provider'"
            );
            const [topDepositors] = await db.query(`
                SELECT u.id, u.name, u.role,
                       COALESCE(SUM(t.amount), 0) AS total_deposited
                FROM users u
                INNER JOIN transactions t ON t.user_id = u.id AND t.type = 'deposit'
                GROUP BY u.id, u.name, u.role
                ORDER BY total_deposited DESC
                LIMIT 5
            `);
            const [topEarners] = await db.query(`
                SELECT u.id, u.name, u.role,
                       COALESCE(SUM(t.amount), 0) AS total_earned
                FROM users u
                INNER JOIN transactions t ON t.user_id = u.id AND t.type IN ('earning', 'event_income')
                GROUP BY u.id, u.name, u.role
                ORDER BY total_earned DESC
                LIMIT 5
            `);
            const [ledger] = await db.query(`
                SELECT t.id, t.type, t.amount, t.status, t.description, t.created_at,
                       u.id AS user_id, u.name AS user_name, u.role AS user_role
                FROM transactions t
                JOIN users u ON u.id = t.user_id
                ORDER BY t.created_at DESC
                LIMIT 100
            `);

            const totalDeposits = Number(depositRows[0].total);
            const totalWithdrawals = Number(withdrawRows[0].total);
            const totalEarnings = Number(earningRows[0].total);
            const netHoldings = totalDeposits - totalWithdrawals;

            res.json({
                stats: {
                    totalDeposits,
                    totalWithdrawals,
                    totalEarnings,
                    netHoldings,
                    totalUsers: Number(userCountRows[0].total),
                    totalProviders: Number(providerCountRows[0].total),
                },
                topDepositors,
                topEarners,
                ledger,
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;