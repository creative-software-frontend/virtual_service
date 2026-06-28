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

// Get User Events
router.get("/events", authMiddleware, (req, res) => {
    const userId = req.user.id;
    db.query(
        `SELECT e.*, 
                u.name as creator_name,
                (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as participant_count,
                IF(EXISTS(SELECT 1 FROM event_participants WHERE event_id = e.id AND user_id = ?), 1, 0) as joined
         FROM events e
         JOIN users u ON e.creator_id = u.id
         ORDER BY e.date_time ASC`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Database error: " + err.message });
            res.json(rows);
        }
    );
});

// Join Event
router.post("/events/:id/join", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    // Check event exists and capacity
    db.query(
        "SELECT * FROM events WHERE id = ?",
        [eventId],
        (err, eventRows) => {
            if (err) return res.status(500).json({ message: "Database error: " + err.message });
            if (eventRows.length === 0) return res.status(404).json({ message: "Event not found" });

            const event = eventRows[0];
            if (event.status !== 'active') {
                return res.status(400).json({ message: "This event is not active" });
            }

            // Check if already joined
            db.query(
                "SELECT 1 FROM event_participants WHERE event_id = ? AND user_id = ?",
                [eventId, userId],
                (err2, participantRows) => {
                    if (err2) return res.status(500).json({ message: err2.message });
                    if (participantRows.length > 0) {
                        return res.status(400).json({ message: "You have already joined this event" });
                    }

                    // Check capacity
                    db.query(
                        "SELECT COUNT(*) as count FROM event_participants WHERE event_id = ?",
                        [eventId],
                        (err3, countRows) => {
                            if (err3) return res.status(500).json({ message: err3.message });
                            const currentCount = countRows[0].count;

                            if (event.capacity > 0 && currentCount >= event.capacity) {
                                return res.status(400).json({ message: "This event has reached its capacity limit" });
                            }

                            // Join
                            db.query(
                                "INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)",
                                [eventId, userId],
                                (err4) => {
                                    if (err4) return res.status(500).json({ message: "Database error: " + err4.message });
                                    res.json({ message: "Successfully joined the event" });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// Leave Event
router.post("/events/:id/leave", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    db.query(
        "DELETE FROM event_participants WHERE event_id = ? AND user_id = ?",
        [eventId, userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Database error: " + err.message });
            if (result.affectedRows === 0) {
                return res.status(400).json({ message: "You are not a participant in this event" });
            }
            res.json({ message: "Successfully left the event" });
        }
    );
});

module.exports = router;