const db = require("../config/db");

const ALLOWED_PAYMENT_METHODS = ["bKash", "Nagad"];
const ALLOWED_STATUSES = ["Pending", "Approved", "Rejected"];

async function createProviderWithdrawRequest(userId, payload = {}) {
    return createWithdrawRequest(userId, payload);
}

function normalizeMethod(method) {
    if (typeof method !== "string") return null;
    const trimmed = method.trim();
    return ALLOWED_PAYMENT_METHODS.includes(trimmed) ? trimmed : null;
}

function normalizeStatus(status) {
    if (typeof status !== "string") return null;
    const trimmed = status.trim();
    return ALLOWED_STATUSES.includes(trimmed) ? trimmed : null;
}

function isValidAmount(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 && parsed <= 100000000;
}

function isValidScreenshot(value) {
    if (typeof value !== "string" || !value.trim()) {
        return false;
    }

    const trimmed = value.trim();
    if (!trimmed.startsWith("data:image/")) {
        return false;
    }

    return /^(data:image\/(jpeg|png|jpg|gif|webp);base64,)/i.test(trimmed);
}

async function createDepositRequest(userId, payload = {}) {
    const amount = payload.amount;
    const method = normalizeMethod(payload.method);
    const trxId = String(payload.trx_id || "").trim();
    const screenshotUrl = String(payload.screenshot_url || payload.screenshot || "").trim();

    if (!isValidAmount(amount)) {
        const error = new Error("Invalid deposit amount");
        error.statusCode = 400;
        throw error;
    }

    if (!method) {
        const error = new Error("Payment method must be either bKash or Nagad");
        error.statusCode = 400;
        throw error;
    }

    if (!trxId) {
        const error = new Error("Transaction ID is required");
        error.statusCode = 400;
        throw error;
    }

    if (screenshotUrl && !isValidScreenshot(screenshotUrl)) {
        const error = new Error("A valid image screenshot was provided but is invalid");
        error.statusCode = 400;
        throw error;
    }

    const [existing] = await db.query(
        "SELECT id FROM deposit_requests WHERE trx_id = ? LIMIT 1",
        [trxId]
    );

    if (existing && existing.length) {
        const error = new Error("Transaction ID already exists");
        error.statusCode = 409;
        throw error;
    }

    const [result] = await db.query(
        `INSERT INTO deposit_requests (user_id, amount, method, trx_id, screenshot_url, status)
         VALUES (?, ?, ?, ?, ?, 'Pending')`,
        [userId, Number(amount).toFixed(2), method, trxId, screenshotUrl || ""]
    );

    const [rows] = await db.query(
        `SELECT id, user_id, amount, method, trx_id, screenshot_url, status, admin_note, approved_by, approved_at, created_at
         FROM deposit_requests WHERE id = ? LIMIT 1`,
        [result.insertId]
    );

    return rows[0];
}

async function getUserDepositHistory(userId) {
    const [rows] = await db.query(
        `SELECT id, user_id, amount, method, trx_id, screenshot_url, status, admin_note, approved_by, approved_at, created_at
         FROM deposit_requests WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
}

async function createWithdrawRequest(userId, payload = {}) {
    const amount = payload.amount;
    const method = normalizeMethod(payload.method);
    const accountNumber = String(payload.account_number || "").trim();

    if (!isValidAmount(amount)) {
        const error = new Error("Invalid withdrawal amount");
        error.statusCode = 400;
        throw error;
    }

    if (!method) {
        const error = new Error("Payment method must be either bKash or Nagad");
        error.statusCode = 400;
        throw error;
    }

    if (!accountNumber) {
        const error = new Error("Account number is required");
        error.statusCode = 400;
        throw error;
    }

    const [result] = await db.query(
        `INSERT INTO withdraw_requests (user_id, amount, method, account_number, status)
         VALUES (?, ?, ?, ?, 'Pending')`,
        [userId, Number(amount).toFixed(2), method, accountNumber]
    );

    const [rows] = await db.query(
        `SELECT id, user_id, amount, method, account_number, status, admin_note, approved_by, approved_at, created_at
         FROM withdraw_requests WHERE id = ? LIMIT 1`,
        [result.insertId]
    );

    return rows[0];
}

async function getUserWithdrawHistory(userId) {
    const [rows] = await db.query(
        `SELECT id, user_id, amount, method, account_number, status, admin_note, approved_by, approved_at, created_at
         FROM withdraw_requests WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
}

async function getWalletSummary(userId) {
    const [userRows] = await db.query(
        "SELECT balance, earnings, role FROM users WHERE id = ? LIMIT 1",
        [userId]
    );

    if (!userRows.length) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const [txRows] = await db.query(
        `SELECT id, type, amount, status, description, created_at
         FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
        [userId]
    );

    return {
        balance: userRows[0].balance || 0,
        earnings: userRows[0].earnings || 0,
        role: userRows[0].role,
        transactions: txRows || [],
    };
}

async function getAdminDepositRequests() {
    const [rows] = await db.query(
        `SELECT dr.id, dr.user_id, dr.amount, dr.method, dr.trx_id, dr.screenshot_url, dr.status, dr.admin_note, dr.approved_by, dr.approved_at, dr.created_at,
                u.name AS user_name, u.email AS user_email
         FROM deposit_requests dr
         LEFT JOIN users u ON u.id = dr.user_id
         ORDER BY dr.created_at DESC`
    );
    return rows;
}

async function approveDepositRequest(adminId, depositId, adminNote = "") {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [depositRows] = await connection.query(
            `SELECT id, user_id, amount, status FROM deposit_requests WHERE id = ? FOR UPDATE`,
            [depositId]
        );

        if (!depositRows.length) {
            const error = new Error("Deposit request not found");
            error.statusCode = 404;
            throw error;
        }

        const deposit = depositRows[0];
        if (deposit.status !== "Pending") {
            const error = new Error("Deposit request is no longer pending");
            error.statusCode = 400;
            throw error;
        }

        const [userRows] = await connection.query(
            `SELECT id, balance FROM users WHERE id = ? FOR UPDATE`,
            [deposit.user_id]
        );

        if (!userRows.length) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        await connection.query(
            `UPDATE users SET balance = balance + ? WHERE id = ?`,
            [Number(deposit.amount), deposit.user_id]
        );

        await connection.query(
            `INSERT INTO transactions (user_id, type, amount, status, description)
             VALUES (?, 'deposit', ?, 'completed', 'Deposit approved manually')`,
            [deposit.user_id, Number(deposit.amount)]
        );

        await connection.query(
            `UPDATE deposit_requests
             SET status = 'Approved', admin_note = ?, approved_by = ?, approved_at = NOW()
             WHERE id = ?`,
            [adminNote.trim(), adminId, depositId]
        );

        await connection.commit();

        const [updatedRows] = await db.query(
            `SELECT id, user_id, amount, method, trx_id, screenshot_url, status, admin_note, approved_by, approved_at, created_at
             FROM deposit_requests WHERE id = ? LIMIT 1`,
            [depositId]
        );

        return updatedRows[0];
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function rejectDepositRequest(adminId, depositId, adminNote = "") {
    const [result] = await db.query(
        `UPDATE deposit_requests
         SET status = 'Rejected', admin_note = ?, approved_by = ?, approved_at = NOW()
         WHERE id = ?`,
        [adminNote.trim(), adminId, depositId]
    );

    if (result.affectedRows === 0) {
        const error = new Error("Deposit request not found");
        error.statusCode = 404;
        throw error;
    }

    const [rows] = await db.query(
        `SELECT id, user_id, amount, method, trx_id, screenshot_url, status, admin_note, approved_by, approved_at, created_at
         FROM deposit_requests WHERE id = ? LIMIT 1`,
        [depositId]
    );

    return rows[0];
}

async function getAdminWithdrawRequests() {
    const [rows] = await db.query(
        `SELECT wr.id, wr.user_id, wr.amount, wr.method, wr.account_number, wr.status, wr.admin_note, wr.approved_by, wr.approved_at, wr.created_at,
                u.name AS user_name, u.email AS user_email
         FROM withdraw_requests wr
         LEFT JOIN users u ON u.id = wr.user_id
         ORDER BY wr.created_at DESC`
    );
    return rows;
}

async function approveWithdrawRequest(adminId, withdrawId, adminNote = "") {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [withdrawRows] = await connection.query(
            `SELECT id, user_id, amount, status FROM withdraw_requests WHERE id = ? FOR UPDATE`,
            [withdrawId]
        );

        if (!withdrawRows.length) {
            const error = new Error("Withdrawal request not found");
            error.statusCode = 404;
            throw error;
        }

        const withdraw = withdrawRows[0];
        if (withdraw.status !== "Pending") {
            const error = new Error("Withdrawal request is no longer pending");
            error.statusCode = 400;
            throw error;
        }

        const [userRows] = await connection.query(
            `SELECT id, balance, earnings, role FROM users WHERE id = ? FOR UPDATE`,
            [withdraw.user_id]
        );

        if (!userRows.length) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const user = userRows[0];
        const isProvider = user.role === "provider";
        const fundsField = isProvider ? "earnings" : "balance";
        const fundsAmount = Number(user[fundsField] || 0);

        if (fundsAmount < Number(withdraw.amount)) {
            const error = new Error(
                isProvider
                    ? "Insufficient earnings for withdrawal approval"
                    : "Insufficient balance for withdrawal approval"
            );
            error.statusCode = 409;
            throw error;
        }

        await connection.query(
            `UPDATE users SET ${fundsField} = ${fundsField} - ? WHERE id = ?`,
            [Number(withdraw.amount), withdraw.user_id]
        );

        await connection.query(
            `INSERT INTO transactions (user_id, type, amount, status, description)
             VALUES (?, 'withdraw', ?, 'completed', 'Withdrawal approved manually')`,
            [withdraw.user_id, Number(withdraw.amount)]
        );

        await connection.query(
            `UPDATE withdraw_requests
             SET status = 'Approved', admin_note = ?, approved_by = ?, approved_at = NOW()
             WHERE id = ?`,
            [adminNote.trim(), adminId, withdrawId]
        );

        await connection.commit();

        const [updatedRows] = await db.query(
            `SELECT id, user_id, amount, method, account_number, status, admin_note, approved_by, approved_at, created_at
             FROM withdraw_requests WHERE id = ? LIMIT 1`,
            [withdrawId]
        );

        return updatedRows[0];
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function rejectWithdrawRequest(adminId, withdrawId, adminNote = "") {
    const [result] = await db.query(
        `UPDATE withdraw_requests
         SET status = 'Rejected', admin_note = ?, approved_by = ?, approved_at = NOW()
         WHERE id = ?`,
        [adminNote.trim(), adminId, withdrawId]
    );

    if (result.affectedRows === 0) {
        const error = new Error("Withdrawal request not found");
        error.statusCode = 404;
        throw error;
    }

    const [rows] = await db.query(
        `SELECT id, user_id, amount, method, account_number, status, admin_note, approved_by, approved_at, created_at
         FROM withdraw_requests WHERE id = ? LIMIT 1`,
        [withdrawId]
    );

    return rows[0];
}

module.exports = {
    createDepositRequest,
    getUserDepositHistory,
    createWithdrawRequest,
    createProviderWithdrawRequest,
    getUserWithdrawHistory,
    getWalletSummary,
    getAdminDepositRequests,
    approveDepositRequest,
    rejectDepositRequest,
    getAdminWithdrawRequests,
    approveWithdrawRequest,
    rejectWithdrawRequest,
};
