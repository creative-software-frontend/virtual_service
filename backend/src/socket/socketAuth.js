const jwt = require("jsonwebtoken");
const db = require("../config/db");

async function verifySocketJwt(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }

    // Determine role from DB to avoid trusting token role
    const [rows] = await db.query("SELECT role FROM users WHERE id = ?", [decoded.id]);
    if (!rows || rows.length === 0) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }

    return {
        userId: decoded.id,
        role: rows[0].role
    };
}

module.exports = {
    verifySocketJwt
};

