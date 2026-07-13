const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { requireFeature } = require("../middleware/membershipMiddleware");

const db = require("../config/db");
const newsfeedController = require("../controllers/newsfeedController");
const chatService = require("../services/chatService");

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
    requireFeature("CHAT"),
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
    requireFeature("CHAT"),
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
    requireFeature("CHAT"),
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

// ── GET /api/provider/posts — get all posts with author info + interaction counts
router.get(
    "/posts",
    authMiddleware,
    roleMiddleware(["user", "provider", "admin"]),
    (req, res) => {
        const userId = req.user.id;
        db.query(
            `SELECT p.id, p.content, p.image_url, p.created_at,
                    u.id AS user_id, u.name AS author_name, u.role AS author_role,
                    (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) AS like_count,
                    (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = p.id) AS comment_count,
                    (SELECT COUNT(*) FROM post_shares ps WHERE ps.post_id = p.id) AS share_count,
                    (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.id AND pl2.user_id = ?) AS user_has_liked
             FROM posts p
             JOIN users u ON u.id = p.user_id
             ORDER BY p.created_at DESC
             LIMIT 50`,
            [userId],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                const mapped = rows.map(r => ({
                    ...r,
                    like_count: Number(r.like_count),
                    comment_count: Number(r.comment_count),
                    share_count: Number(r.share_count),
                    user_has_liked: Number(r.user_has_liked) > 0,
                }));
                res.json(mapped);
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
    requireFeature("CHAT"),
    async (req, res) => {

        const me = req.user.id;
        const partner = parseInt(req.query.with, 10);
        if (!partner) return res.status(400).json({ message: "Missing 'with' query param." });

        try {
            const rows = await chatService.getMessages({ senderId: me, partnerId: partner });
            res.json(rows);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message || "Database error" });
        }
    }
);

// ── POST /api/provider/messages — send a DM
router.post(
    "/messages",
    authMiddleware,
    roleMiddleware(["user", "provider"]),
    requireFeature("CHAT"),
    async (req, res) => {

        const { receiver_id, message } = req.body;
        if (!receiver_id || !message || !message.trim()) {
            return res.status(400).json({ message: "receiver_id and message are required." });
        }

        try {
            const sender_id = req.user.id;
            const inserted = await chatService.sendMessage({
                senderId: sender_id,
                receiverId: receiver_id,
                message: message
            });
            res.status(201).json(inserted);
        } catch (err) {
            res.status(err.statusCode || 500).json({ message: err.message || "Database error" });
        }
    }
);


// Create Event
router.post(
    "/events",
    authMiddleware,
    roleMiddleware(["provider"]),
    (req, res) => {
        const { title, description, date_time, location, capacity, host_name, entry_fee, application_deadline } = req.body;

        if (!title || !date_time || !location) {
            return res.status(400).json({ message: "Title, date/time, and location are required." });
        }

        if (!host_name || typeof host_name !== 'string' || host_name.trim().length < 1) {
            return res.status(400).json({ message: "host_name is required" });
        }
        if (host_name.trim().length > 150) {
            return res.status(400).json({ message: "host_name must be 150 characters or less" });
        }

        const feeNum = Number(entry_fee);
        if (entry_fee === undefined || entry_fee === null || Number.isNaN(feeNum)) {
            return res.status(400).json({ message: "entry_fee is required" });
        }
        if (feeNum < 0) {
            return res.status(400).json({ message: "entry_fee cannot be negative" });
        }

        if (!application_deadline) {
            return res.status(400).json({ message: "application_deadline is required" });
        }
        const appDeadline = new Date(application_deadline);
        const eventStart = new Date(date_time);
        if (isNaN(appDeadline.getTime()) || isNaN(eventStart.getTime())) {
            return res.status(400).json({ message: "Invalid application_deadline or date_time" });
        }
        if (appDeadline.getTime() >= eventStart.getTime()) {
            return res.status(400).json({ message: "application_deadline must be before the event start time" });
        }

        const creatorId = req.user.id;
        db.query(
            `INSERT INTO events (title, description, date_time, location, capacity, creator_id, host_name, entry_fee, application_deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title.trim(),
                description ? description.trim() : null,
                date_time,
                location.trim(),
                capacity || 0,
                creatorId,
                host_name.trim(),
                feeNum,
                application_deadline
            ],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                res.status(201).json({
                    id: result.insertId,
                    title,
                    description,
                    date_time,
                    location,
                    capacity: capacity || 0,
                    host_name: host_name,
                    entry_fee: feeNum,
                    application_deadline,
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
        const { title, description, date_time, location, capacity, status, host_name, entry_fee, application_deadline } = req.body;
        const eventId = req.params.id;
        const providerId = req.user.id;

        if (!title || !date_time || !location) {
            return res.status(400).json({ message: "Title, date/time, and location are required." });
        }
        if (!host_name || typeof host_name !== 'string' || host_name.trim().length < 1) {
            return res.status(400).json({ message: "host_name is required" });
        }
        if (host_name.trim().length > 150) {
            return res.status(400).json({ message: "host_name must be 150 characters or less" });
        }

        const feeNum = Number(entry_fee);
        if (entry_fee === undefined || entry_fee === null || Number.isNaN(feeNum)) {
            return res.status(400).json({ message: "entry_fee is required" });
        }
        if (feeNum < 0) {
            return res.status(400).json({ message: "entry_fee cannot be negative" });
        }

        if (!application_deadline) {
            return res.status(400).json({ message: "application_deadline is required" });
        }
        const appDeadline = new Date(application_deadline);
        const eventStart = new Date(date_time);
        if (isNaN(appDeadline.getTime()) || isNaN(eventStart.getTime())) {
            return res.status(400).json({ message: "Invalid application_deadline or date_time" });
        }
        if (appDeadline.getTime() >= eventStart.getTime()) {
            return res.status(400).json({ message: "application_deadline must be before the event start time" });
        }

        db.query(
            `UPDATE events SET title = ?, description = ?, date_time = ?, location = ?, capacity = ?, status = ?, host_name = ?, entry_fee = ?, application_deadline = ? WHERE id = ? AND creator_id = ?`,
            [
                title.trim(),
                description ? description.trim() : null,
                date_time,
                location.trim(),
                capacity || 0,
                status || 'active',
                host_name.trim(),
                feeNum,
                application_deadline,
                eventId,
                providerId
            ],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error: " + err.message });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Event not found or you are not authorized to edit it." });
                }
                res.json({ id: eventId, title, description, date_time, location, capacity, status, host_name, entry_fee: feeNum, application_deadline });
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

// ── POST /api/provider/posts/:id/like — toggle like on a post
router.post(
    "/posts/:id/like",
    authMiddleware,
    roleMiddleware(["user", "provider", "admin"]),
    newsfeedController.toggleLike
);

// ── GET /api/provider/posts/:id/comments — fetch paginated comments
router.get(
    "/posts/:id/comments",
    authMiddleware,
    roleMiddleware(["user", "provider", "admin"]),
    newsfeedController.getComments
);

// ── POST /api/provider/posts/:id/comment — add a comment
router.post(
    "/posts/:id/comment",
    authMiddleware,
    roleMiddleware(["user", "provider", "admin"]),
    newsfeedController.addComment
);

// ── POST /api/provider/posts/:id/share — record a share
router.post(
    "/posts/:id/share",
    authMiddleware,
    roleMiddleware(["user", "provider", "admin"]),
    newsfeedController.sharePost
);

module.exports = router;
