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

// ── GET /api/provider/active-providers (for user dashboard)
router.get(
    "/active-providers",
    authMiddleware,
    roleMiddleware(["user", "provider", "admin"]),
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

// ── GET /api/provider/posts — get all posts with author info
router.get(
    "/posts",
    authMiddleware,
    roleMiddleware(["user", "provider", "admin"]),
    (req, res) => {
        db.query(
            `SELECT p.id, p.content, p.image_url, p.created_at,
                    u.id AS user_id, u.name AS author_name, u.role AS author_role
             FROM posts p
             JOIN users u ON u.id = p.user_id
             ORDER BY p.created_at DESC
             LIMIT 50`,
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                res.json(rows);
            }
        );
    }
);

// ── POST /api/provider/posts — create a new post
router.post(
    "/posts",
    authMiddleware,
    roleMiddleware(["user", "provider"]),
    (req, res) => {
        const { content, image_url } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Post content cannot be empty." });
        }
        const userId = req.user.id;
        db.query(
            `INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)`,
            [userId, content.trim(), image_url || null],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                // Return new post with author info
                db.query(
                    `SELECT p.id, p.content, p.image_url, p.created_at,
                            u.id AS user_id, u.name AS author_name, u.role AS author_role
                     FROM posts p JOIN users u ON u.id = p.user_id
                     WHERE p.id = ?`,
                    [result.insertId],
                    (err2, rows) => {
                        if (err2) return res.status(500).json({ message: err2.message });
                        res.status(201).json(rows[0]);
                    }
                );
            }
        );
    }
);

// ── GET /api/provider/messages?with=<userId> — get DM thread
router.get(
    "/messages",
    authMiddleware,
    roleMiddleware(["user", "provider"]),
    (req, res) => {
        const me = req.user.id;
        const partner = parseInt(req.query.with, 10);
        if (!partner) return res.status(400).json({ message: "Missing 'with' query param." });
        db.query(
            `SELECT m.id, m.sender_id, m.receiver_id, m.message, m.created_at,
                    u.name AS sender_name
             FROM chat_messages m
             JOIN users u ON u.id = m.sender_id
             WHERE (m.sender_id = ? AND m.receiver_id = ?)
                OR (m.sender_id = ? AND m.receiver_id = ?)
             ORDER BY m.created_at ASC
             LIMIT 200`,
            [me, partner, partner, me],
            (err, rows) => {
                if (err) return res.status(500).json({ message: err.message });
                res.json(rows);
            }
        );
    }
);

// ── POST /api/provider/messages — send a DM
router.post(
    "/messages",
    authMiddleware,
    roleMiddleware(["user", "provider"]),
    (req, res) => {
        const { receiver_id, message } = req.body;
        if (!receiver_id || !message || !message.trim()) {
            return res.status(400).json({ message: "receiver_id and message are required." });
        }
        const sender_id = req.user.id;
        db.query(
            `INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
            [sender_id, receiver_id, message.trim()],
            (err, result) => {
                if (err) return res.status(500).json({ message: err.message });
                res.status(201).json({ id: result.insertId, sender_id, receiver_id, message: message.trim() });
            }
        );
    }
);

// Create Event
router.post(
    "/events",
    authMiddleware,
    roleMiddleware(["provider"]),
    (req, res) => {
        const { title, description, date_time, location, capacity } = req.body;
        if (!title || !date_time || !location) {
            return res.status(400).json({ message: "Title, date/time, and location are required." });
        }
        const creatorId = req.user.id;
        db.query(
            `INSERT INTO events (title, description, date_time, location, capacity, creator_id) VALUES (?, ?, ?, ?, ?, ?)`,
            [title.trim(), description ? description.trim() : null, date_time, location.trim(), capacity || 0, creatorId],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                res.status(201).json({
                    id: result.insertId,
                    title,
                    description,
                    date_time,
                    location,
                    capacity: capacity || 0,
                    creator_id: creatorId,
                    status: 'active'
                });
            }
        );
    }
);

// Edit Event
router.put(
    "/events/:id",
    authMiddleware,
    roleMiddleware(["provider"]),
    (req, res) => {
        const { title, description, date_time, location, capacity, status } = req.body;
        const eventId = req.params.id;
        const providerId = req.user.id;

        db.query(
            `UPDATE events SET title = ?, description = ?, date_time = ?, location = ?, capacity = ?, status = ? WHERE id = ? AND creator_id = ?`,
            [title.trim(), description ? description.trim() : null, date_time, location.trim(), capacity || 0, status || 'active', eventId, providerId],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Event not found or you are not authorized to edit it." });
                }
                res.json({ id: eventId, title, description, date_time, location, capacity, status });
            }
        );
    }
);

// Delete Event
router.delete(
    "/events/:id",
    authMiddleware,
    roleMiddleware(["provider"]),
    (req, res) => {
        const eventId = req.params.id;
        const providerId = req.user.id;

        db.query(
            `DELETE FROM events WHERE id = ? AND creator_id = ?`,
            [eventId, providerId],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Event not found or you are not authorized to delete it." });
                }
                // also delete participants
                db.query(`DELETE FROM event_participants WHERE event_id = ?`, [eventId]);
                res.json({ message: "Event deleted successfully." });
            }
        );
    }
);

// View Participants
router.get(
    "/events/:id/participants",
    authMiddleware,
    roleMiddleware(["provider"]),
    (req, res) => {
        const eventId = req.params.id;
        db.query(
            `SELECT u.id, u.name, u.email, ep.joined_at 
             FROM event_participants ep 
             JOIN users u ON ep.user_id = u.id 
             WHERE ep.event_id = ?`,
            [eventId],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                res.json(rows);
            }
        );
    }
);

// Get Provider's Events
router.get(
    "/events",
    authMiddleware,
    roleMiddleware(["provider"]),
    (req, res) => {
        const providerId = req.user.id;
        db.query(
            `SELECT e.*, 
                    (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as participant_count,
                    u.name as creator_name
             FROM events e
             JOIN users u ON e.creator_id = u.id
             WHERE e.creator_id = ?
             ORDER BY e.date_time ASC`,
            [providerId],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                res.json(rows);
            }
        );
    }
);

module.exports = router;
