const db = require("../config/db");

const allowedRoles = ["user", "provider"]; // based on existing role names in REST middleware usage

async function validateUserExists(userId) {
    const [rows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (!rows || rows.length === 0) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }
}

async function validateRole(userId) {
    const [rows] = await db.query("SELECT role FROM users WHERE id = ?", [userId]);
    if (!rows || rows.length === 0) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }
    const role = rows[0].role;
    if (!allowedRoles.includes(String(role).toLowerCase())) {
        const err = new Error("Access denied");
        err.statusCode = 403;
        throw err;
    }
    return role;
}

function normalizeMessage(message) {
    if (!message || typeof message !== "string") return null;
    const trimmed = message.trim();
    if (!trimmed) return null;
    return trimmed;
}

async function getMessages({ senderId, partnerId }) {
    if (!senderId || Number.isNaN(Number(senderId))) {
        const err = new Error("Invalid senderId");
        err.statusCode = 400;
        throw err;
    }
    if (!partnerId || Number.isNaN(Number(partnerId))) {
        const err = new Error("Invalid partnerId");
        err.statusCode = 400;
        throw err;
    }

    const me = Number(senderId);
    const partner = Number(partnerId);

    const [rows] = await db.query(
        `SELECT m.id, m.sender_id, m.receiver_id, m.message, m.created_at,
                u.name AS sender_name
         FROM chat_messages m
         JOIN users u ON u.id = m.sender_id
         WHERE (m.sender_id = ? AND m.receiver_id = ?)
            OR (m.sender_id = ? AND m.receiver_id = ?)
         ORDER BY m.created_at ASC
         LIMIT 200`,
        [me, partner, partner, me]
    );

    return rows;
}

async function sendMessage({ senderId, receiverId, message }) {
    const normalized = normalizeMessage(message);
    if (!receiverId || Number.isNaN(Number(receiverId))) {
        const err = new Error("receiver_id and message are required.");
        err.statusCode = 400;
        throw err;
    }
    if (!normalized) {
        const err = new Error("receiver_id and message are required.");
        err.statusCode = 400;
        throw err;
    }

    const sender = Number(senderId);
    const receiver = Number(receiverId);

    if (sender === receiver) {
        const err = new Error("receiver_id and message are required.");
        err.statusCode = 400;
        throw err;
    }

    // Permissions validation (no DB schema changes)
    await validateUserExists(sender);
    await validateUserExists(receiver);
    await validateRole(sender);
    await validateRole(receiver);

    const [result] = await db.query(
        `INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
        [sender, receiver, normalized]
    );

    // Keep REST response format unchanged
    return {
        id: result.insertId,
        sender_id: sender,
        receiver_id: receiver,
        message: normalized
    };
}

module.exports = {
    getMessages,
    sendMessage
};

