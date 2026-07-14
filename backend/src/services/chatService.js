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

/**
 * Returns the latest partner_request status between a user and a provider,
 * or null if no request exists.
 */
async function getPartnerRequestStatus({ userId, providerId }) {
    const [rows] = await db.query(
        `SELECT status FROM partner_requests
         WHERE user_id = ? AND provider_id = ?
         ORDER BY created_at DESC LIMIT 1`,
        [userId, providerId]
    );
    return rows && rows.length ? rows[0].status : null;
}

/**
 * Chat access rule (USER ↔ PROVIDER partner workflow):
 *
 *   A user can chat with a provider only if BOTH are true:
 *     1. The user has membership access to the chat feature (Silver or higher)
 *     2. The partner request status = 'accepted'
 *
 *   Providers bypass membership restrictions but STILL require an accepted
 *   partner request.
 *
 * For any other conversation shape (user↔user, etc.) the existing
 * membership-gated chat behaviour is preserved.
 *
 * Returns { allowed, statusCode?, message? }.
 */
async function checkChatPermission(senderId, receiverId) {
    const sId = Number(senderId);
    const rId = Number(receiverId);

    if (!sId || !rId || sId === rId) {
        const err = new Error("Invalid chat participants");
        err.statusCode = 400;
        throw err;
    }

    const [sRows] = await db.query("SELECT id, role FROM users WHERE id = ? LIMIT 1", [sId]);
    const [rRows] = await db.query("SELECT id, role FROM users WHERE id = ? LIMIT 1", [rId]);
    if (!sRows.length || !rRows.length) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    const senderRole = sRows[0].role;
    const receiverRole = rRows[0].role;

    const isUserProviderPair =
        (senderRole === "user" && receiverRole === "provider") ||
        (senderRole === "provider" && receiverRole === "user");

    if (isUserProviderPair) {
        const userId = senderRole === "user" ? sId : rId;
        const providerId = senderRole === "provider" ? sId : rId;

        const status = await getPartnerRequestStatus({ userId, providerId });
        if (status !== "accepted") {
            return {
                allowed: false,
                statusCode: 403,
                message: "Chat is locked until the partner request is accepted.",
            };
        }

        // Provider bypasses membership; the user still needs chat membership.
        if (senderRole === "user") {
            const { checkFeatureAccess } = require("../middleware/membershipMiddleware");
            const m = await checkFeatureAccess(sId, "CHAT", "user");
            if (!m.allowed) {
                return { allowed: false, statusCode: m.statusCode || 403, message: m.message };
            }
        }
        return { allowed: true };
    }

    // Non user↔provider conversation: existing membership-gated chat.
    const { checkFeatureAccess } = require("../middleware/membershipMiddleware");
    const m = await checkFeatureAccess(sId, "CHAT", senderRole);
    if (!m.allowed) {
        return { allowed: false, statusCode: m.statusCode || 403, message: m.message };
    }
    return { allowed: true };
}

module.exports = {
    getMessages,
    sendMessage,
    checkChatPermission,
    getPartnerRequestStatus
};

