const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

const { getProfile, updateProfile } = require("../controllers/profileController");

// GET /api/user/profile
router.get("/profile", authMiddleware, getProfile);

// PUT /api/user/profile
router.put("/profile", authMiddleware, updateProfile);


// GET /api/user/wallet
router.get("/wallet", authMiddleware, (req, res) => {
    const userId = req.user.id;

    db.query(
        "SELECT balance, earnings, role FROM users WHERE id = ?",
        [userId],
        (err, userResult) => {
            if (err) return res.status(500).json({ message: "Database error" });
            if (userResult.length === 0) return res.status(404).json({ message: "User not found" });

            const user = userResult[0];

            db.query(
                "SELECT id, type, amount, status, description, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
                [userId],
                (err2, txResult) => {
                    if (err2) return res.status(500).json({ message: "Database error" });

                    // Seed provider with initial active mockup transactions if empty
                    if (user.role === "provider" && (!txResult || txResult.length === 0)) {
                        db.query(
                            "UPDATE users SET balance = 8000.00, earnings = 12500.00 WHERE id = ?",
                            [userId],
                            () => {
                                db.query(
                                    "INSERT INTO transactions (user_id, type, amount, status, description) VALUES (?, 'earning', 12500.00, 'completed', 'Platform Service Payout')",
                                    [userId],
                                    () => {
                                        db.query(
                                            "INSERT INTO transactions (user_id, type, amount, status, description) VALUES (?, 'withdraw', 4500.00, 'completed', 'Liquidate Payout')",
                                            [userId],
                                            () => {
                                                db.query(
                                                    "SELECT balance, earnings, role FROM users WHERE id = ?",
                                                    [userId],
                                                    (errSeed, seededUser) => {
                                                        db.query(
                                                            "SELECT id, type, amount, status, description, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
                                                            [userId],
                                                            (errSeedTx, seededTx) => {
                                                                res.json({
                                                                    balance: seededUser[0].balance,
                                                                    earnings: seededUser[0].earnings,
                                                                    role: seededUser[0].role,
                                                                    transactions: seededTx || []
                                                                });
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                        return;
                    }

                    res.json({
                        balance: user.balance || 0,
                        earnings: user.earnings || 0,
                        role: user.role,
                        transactions: txResult || []
                    });
                }
            );
        }
    );
});

// POST /api/user/deposit
router.post("/deposit", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: "Invalid deposit amount" });
    }

    db.query(
        "UPDATE users SET balance = balance + ? WHERE id = ?",
        [numAmount, userId],
        (err) => {
            if (err) return res.status(500).json({ message: "Database error updating balance" });

            db.query(
                "INSERT INTO transactions (user_id, type, amount, status, description) VALUES (?, 'deposit', ?, 'completed', 'Deposit to wallet')",
                [userId, numAmount],
                (err2) => {
                    if (err2) return res.status(500).json({ message: "Database error recording transaction" });
                    res.json({ message: "Deposit successful", amount: numAmount });
                }
            );
        }
    );
});

// POST /api/user/withdraw
router.post("/withdraw", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    db.query(
        "SELECT balance, role FROM users WHERE id = ?",
        [userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Database error checking balance" });
            if (result.length === 0) return res.status(404).json({ message: "User not found" });

            const user = result[0];
            if (user.balance < numAmount) {
                return res.status(400).json({ message: "Insufficient balance for withdrawal" });
            }

            db.query(
                "UPDATE users SET balance = balance - ? WHERE id = ?",
                [numAmount, userId],
                (err2) => {
                    if (err2) return res.status(500).json({ message: "Database error updating balance" });

                    db.query(
                        "INSERT INTO transactions (user_id, type, amount, status, description) VALUES (?, 'withdraw', ?, 'completed', 'Liquidate payout')",
                        [userId, numAmount],
                        (err3) => {
                            if (err3) return res.status(500).json({ message: "Database error recording transaction" });
                            res.json({ message: "Withdrawal successful", amount: numAmount });
                        }
                    );
                }
            );
        }
    );
});

module.exports = router;