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

/**
 * createWithdrawRequest
 * ──────────────────────
 * Before inserting the request, calculate the user's AVAILABLE funds:
 *   available = actual_balance/earnings - sum(pending_withdraw_requests)
 *
 * If the requested amount exceeds available funds, reject with 409.
 * This prevents double-spending of already-reserved funds.
 */
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

    // ── Available balance check ─────────────────────────────────────────────
    const [userRows] = await db.query(
        "SELECT balance, earnings, role FROM users WHERE id = ? LIMIT 1",
        [userId]
    );

    if (!userRows || !userRows.length) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const user = userRows[0];
    const isProvider = user.role === "provider";
    const fundsField = isProvider ? "earnings" : "balance";
    const totalFunds = Number(user[fundsField] || 0);

    // Sum all currently Pending withdrawal requests for this user
    const [pendingRows] = await db.query(
        "SELECT COALESCE(SUM(amount), 0) AS reserved FROM withdraw_requests WHERE user_id = ? AND status = 'Pending'",
        [userId]
    );
    const reserved = Number(pendingRows[0].reserved || 0);
    const available = totalFunds - reserved;

    if (Number(amount) > available) {
        const error = new Error(
            available <= 0
                ? "Insufficient available balance. All funds are reserved for a pending withdrawal."
                : `Insufficient available balance. Available: ৳${available.toFixed(2)} (pending: ৳${reserved.toFixed(2)}).`
        );
        error.statusCode = 409;
        throw error;
    }
    // ───────────────────────────────────────────────────────────────────────

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

/**
 * getWalletSummary
 * ─────────────────
 * Returns:
 *   balance          — raw balance from users table
 *   earnings         — raw earnings from users table
 *   available_balance  — balance minus sum of pending withdrawal requests
 *   available_earnings — earnings minus sum of pending withdrawal requests (provider)
 *   role
 *   transactions     — UNIFIED list of all activity:
 *                        • completed transactions (from transactions table)
 *                        • Pending deposit requests
 *                        • Rejected deposit requests
 *                        • Pending withdraw requests
 *                        • Rejected withdraw requests
 *                      (Approved requests are already in transactions as completed rows)
 */
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

    const user = userRows[0];

    // ── Completed transactions ──────────────────────────────────────────────
    const [txRows] = await db.query(
        `SELECT id, type, amount, status, description, created_at
         FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`,
        [userId]
    );

    // ── Pending & Rejected deposit requests ─────────────────────────────────
    const [depositReqRows] = await db.query(
        `SELECT id, amount, method, trx_id, status, admin_note, created_at
         FROM deposit_requests
         WHERE user_id = ? AND status IN ('Pending', 'Rejected')
         ORDER BY created_at DESC`,
        [userId]
    );

    // ── Pending & Rejected withdraw requests ────────────────────────────────
    const [withdrawReqRows] = await db.query(
        `SELECT id, amount, method, account_number, status, admin_note, created_at
         FROM withdraw_requests
         WHERE user_id = ? AND status IN ('Pending', 'Rejected')
         ORDER BY created_at DESC`,
        [userId]
    );

    // ── Calculate available funds (deduct pending withdrawals) ──────────────
    const [pendingRows] = await db.query(
        "SELECT COALESCE(SUM(amount), 0) AS reserved FROM withdraw_requests WHERE user_id = ? AND status = 'Pending'",
        [userId]
    );
    const reserved = Number(pendingRows[0].reserved || 0);
    const balance = Number(user.balance || 0);
    const earnings = Number(user.earnings || 0);
    const isProvider = user.role === "provider";

    const available_balance = isProvider
        ? balance  // providers withdraw from earnings, not balance
        : Math.max(0, balance - reserved);

    const available_earnings = isProvider
        ? Math.max(0, earnings - reserved)
        : earnings;

    // ── Map request rows to unified Transaction shape ───────────────────────
    const depositReqTx = depositReqRows.map((r) => ({
        id: `dep_req_${r.id}`,
        type: "deposit",
        amount: r.amount,
        status: r.status.toLowerCase(),   // 'pending' | 'rejected'
        description: `Deposit request via ${r.method} (TXN: ${r.trx_id})${r.admin_note ? ` — ${r.admin_note}` : ""}`,
        created_at: r.created_at,
        _source: "request",
    }));

    const withdrawReqTx = withdrawReqRows.map((r) => ({
        id: `wd_req_${r.id}`,
        type: "withdraw",
        amount: r.amount,
        status: r.status.toLowerCase(),   // 'pending' | 'rejected'
        description: `Withdrawal request via ${r.method} to ${r.account_number}${r.admin_note ? ` — ${r.admin_note}` : ""}`,
        created_at: r.created_at,
        _source: "request",
    }));

    // Completed txs already have the right shape; normalise status to lowercase
    const completedTx = (txRows || []).map((tx) => ({
        ...tx,
        status: (tx.status || "completed").toLowerCase(),
    }));

    // Merge and sort newest-first
    const allTransactions = [...depositReqTx, ...withdrawReqTx, ...completedTx].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return {
        balance,
        earnings,
        available_balance,
        available_earnings,
        role: user.role,
        transactions: allTransactions,
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

        // Safety net: ensure actual stored funds cover the withdrawal
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

/**
 * rejectWithdrawRequest
 * ──────────────────────
 * Simply marks the request as Rejected.
 * No balance change is needed — the funds were NEVER deducted at submission time.
 * The next available-balance calculation will naturally exclude this request
 * because it's no longer 'Pending', so reserved amount drops.
 */
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
