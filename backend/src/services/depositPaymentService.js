const db = require("../config/db");

const METHODS = new Set(["bkash", "nagad", "merchant"]);
const ACCOUNT_TYPES = new Set(["personal", "agent"]);
// Bangladesh mobile: 01[3-9] followed by 8 digits (11 total) — matches the
// project's existing mobile-validation convention (see walletService).
const BD_MOBILE = /^01[3-9][0-9]{8}$/;
// Merchant account numbers are freeform account/merchant IDs: digits only,
// after stripping separators, between 6 and 20 characters.
const MERCHANT_NUMBER = /^[0-9]{6,20}$/;

function normalizeMethod(v) {
    if (typeof v !== "string") return null;
    const m = v.trim().toLowerCase();
    return METHODS.has(m) ? m : null;
}

function normalizeAccountType(v) {
    if (typeof v !== "string") return null;
    const t = v.trim().toLowerCase();
    return ACCOUNT_TYPES.has(t) ? t : null;
}

function normalizeAccountNumber(v) {
    if (typeof v !== "string") return null;
    const digits = v.replace(/\D/g, "");
    return BD_MOBILE.test(digits) ? digits : null;
}

function normalizeMerchantNumber(v) {
    if (typeof v !== "string") return null;
    const digits = v.replace(/[\s-]/g, "");
    return MERCHANT_NUMBER.test(digits) ? digits : null;
}

function normalizeProviderName(v) {
    if (typeof v !== "string") return null;
    const name = v.trim();
    return name.length >= 2 && name.length <= 100 ? name : null;
}

function normalizeInstructions(v) {
    if (v === undefined || v === null) return null;
    if (typeof v !== "string") return undefined; // invalid type → error
    const text = v.trim();
    if (!text) return null;
    return text.length <= 2000 ? text : undefined;
}

function normalizeImageUrl(v) {
    if (v === undefined || v === null || v === "") return null;
    if (typeof v !== "string") return undefined; // invalid type → error
    const url = v.trim();
    if (!url) return null;
    const looksLikeUploadedUrl =
        url.startsWith("/uploads/") || url.startsWith("http://") || url.startsWith("https://");
    return looksLikeUploadedUrl && url.length <= 500 ? url : undefined;
}

function toRow(row) {
    return {
        id: row.id,
        method: row.method,
        provider_name: row.provider_name ?? null,
        account_number: row.account_number,
        account_type: row.account_type ?? null,
        instructions: row.instructions ?? null,
        instruction_image_url: row.instruction_image_url ?? null,
        is_active: Number(row.is_active),
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

function validationError(msg) {
    const err = new Error(msg);
    err.statusCode = 400;
    return err;
}

const SELECT_COLUMNS = `id, method, provider_name, account_number, account_type, instructions, instruction_image_url, is_active, created_at, updated_at`;

async function listMethods({ includeInactive = false } = {}) {
    const where = includeInactive ? "" : "WHERE is_active = 1";
    const [rows] = await db.query(
        `SELECT ${SELECT_COLUMNS}
         FROM deposit_payment_methods ${where}
         ORDER BY method ASC, account_type ASC, id ASC`
    );
    return rows.map(toRow);
}

async function getActiveMethods() {
    return listMethods({ includeInactive: false });
}

async function getMethodById(id) {
    const [rows] = await db.query(
        `SELECT ${SELECT_COLUMNS}
         FROM deposit_payment_methods WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows.length ? toRow(rows[0]) : null;
}

/**
 * Atomically ensures only one ACTIVE row per `method`: when a method is being
 * activated, every other active row of the same method is deactivated first.
 */
async function deactivateOthers(connection, method, excludeId) {
    if (excludeId == null) {
        await connection.query(
            `UPDATE deposit_payment_methods SET is_active = 0 WHERE method = ? AND is_active = 1`,
            [method]
        );
    } else {
        await connection.query(
            `UPDATE deposit_payment_methods SET is_active = 0 WHERE method = ? AND is_active = 1 AND id != ?`,
            [method, excludeId]
        );
    }
}

/** Validates + normalizes merchant-specific fields. Returns {error?, values} */
function resolveMerchantFields({ provider_name, instructions, instruction_image_url }, { required }) {
    let nextProviderName;
    if (provider_name !== undefined) {
        nextProviderName = normalizeProviderName(provider_name);
        if (!nextProviderName) {
            return { error: 'provider_name is required for merchant methods (2–100 characters)' };
        }
    } else if (required) {
        return { error: 'provider_name is required for merchant methods' };
    }

    let nextInstructions;
    if (instructions !== undefined) {
        nextInstructions = normalizeInstructions(instructions);
        if (nextInstructions === undefined) {
            return { error: 'instructions must be a string of at most 2000 characters' };
        }
    }

    let nextImage;
    if (instruction_image_url !== undefined) {
        nextImage = normalizeImageUrl(instruction_image_url);
        if (nextImage === undefined) {
            return { error: 'instruction_image_url must be an uploaded image URL (/uploads/... or https://...)' };
        }
    }

    return {
        values: {
            provider_name: nextProviderName,
            instructions: nextInstructions === undefined ? null : nextInstructions,
            instruction_image_url: nextImage === undefined ? null : nextImage,
        },
    };
}

async function createMethod(payload = {}) {
    const { method, account_number, account_type, is_active = true } = payload;
    const m = normalizeMethod(method);

    if (!m) throw validationError('method must be "bkash", "nagad" or "merchant"');

    let num;
    let t = null;
    let merchant;

    if (m === "merchant") {
        num = normalizeMerchantNumber(account_number);
        if (!num) throw validationError("account_number must be a valid merchant number (6–20 digits)");
        merchant = resolveMerchantFields(payload, { required: true });
        if (merchant.error) throw validationError(merchant.error);
    } else {
        t = normalizeAccountType(account_type);
        num = normalizeAccountNumber(account_number);
        if (!t) throw validationError('account_type must be "personal" or "agent"');
        if (!num) throw validationError("account_number must be a valid Bangladesh mobile number (01[3-9]XXXXXXXX)");
        merchant = { values: { provider_name: null, instructions: null, instruction_image_url: null } };
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        if (is_active) {
            await deactivateOthers(connection, m);
        }

        const [result] = await connection.query(
            `INSERT INTO deposit_payment_methods
                (method, provider_name, account_number, account_type, instructions, instruction_image_url, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                m,
                merchant.values.provider_name,
                num,
                t,
                merchant.values.instructions,
                merchant.values.instruction_image_url,
                is_active ? 1 : 0,
            ]
        );

        await connection.commit();
        return getMethodById(result.insertId);
    } catch (err) {
        await connection.rollback();
        if (err && err.code === "ER_DUP_ENTRY") {
            const dup = new Error("A payment method with this method + account type already exists");
            dup.statusCode = 409;
            throw dup;
        }
        throw err;
    } finally {
        connection.release();
    }
}

async function updateMethod(id, payload = {}) {
    const { account_number, account_type, is_active, provider_name, instructions, instruction_image_url } = payload;
    const current = await getMethodById(id);
    if (!current) {
        const err = new Error("Payment method not found");
        err.statusCode = 404;
        throw err;
    }

    const isMerchant = current.method === "merchant";

    let nextType;
    let nextNum;
    let merchant;

    if (isMerchant) {
        nextNum = account_number !== undefined ? normalizeMerchantNumber(account_number) : current.account_number;
        if (account_number !== undefined && !nextNum) {
            throw validationError("account_number must be a valid merchant number (6–20 digits)");
        }
        // Every provided field is validated; omitted optional fields keep current values.
        merchant = resolveMerchantFields(
            {
                provider_name: provider_name !== undefined ? provider_name : current.provider_name,
                instructions: instructions !== undefined ? instructions : current.instructions,
                instruction_image_url: instruction_image_url !== undefined ? instruction_image_url : current.instruction_image_url,
            },
            { required: true }
        );
        if (merchant.error) throw validationError(merchant.error);
    } else {
        nextType = account_type !== undefined ? normalizeAccountType(account_type) : current.account_type;
        nextNum = account_number !== undefined ? normalizeAccountNumber(account_number) : current.account_number;
        if (account_type !== undefined && !nextType) throw validationError('account_type must be "personal" or "agent"');
        if (account_number !== undefined && !nextNum) throw validationError("account_number must be a valid Bangladesh mobile number (01[3-9]XXXXXXXX)");
        merchant = { values: { provider_name: current.provider_name, instructions: current.instructions, instruction_image_url: current.instruction_image_url } };
    }

    const nextActive = is_active !== undefined ? !!is_active : Boolean(current.is_active === 1);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        if (nextActive) {
            await deactivateOthers(connection, current.method, id);
        }

        await connection.query(
            `UPDATE deposit_payment_methods
             SET provider_name = ?, account_number = ?, account_type = ?, instructions = ?, instruction_image_url = ?, is_active = ?
             WHERE id = ?`,
            [
                merchant.values.provider_name,
                nextNum,
                isMerchant ? null : nextType,
                merchant.values.instructions,
                merchant.values.instruction_image_url,
                nextActive ? 1 : 0,
                id,
            ]
        );

        await connection.commit();
        return getMethodById(id);
    } catch (err) {
        await connection.rollback();
        if (err && err.code === "ER_DUP_ENTRY") {
            const dup = new Error("A payment method with this method + account type already exists");
            dup.statusCode = 409;
            throw dup;
        }
        throw err;
    } finally {
        connection.release();
    }
}

async function toggleMethod(id, isActive) {
    const current = await getMethodById(id);
    if (!current) {
        const err = new Error("Payment method not found");
        err.statusCode = 404;
        throw err;
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        if (isActive) {
            await deactivateOthers(connection, current.method, id);
        }

        await connection.query(
            `UPDATE deposit_payment_methods SET is_active = ? WHERE id = ?`,
            [isActive ? 1 : 0, id]
        );

        await connection.commit();
        return getMethodById(id);
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

/**
 * Deletes a payment method row. Only merchant rows are deletable — bkash/nagad
 * configurations are permanent singletons by design. A merchant row that is
 * referenced by any historical deposit request cannot be deleted (its details
 * are part of the deposit audit trail); disable it instead.
 */
async function deleteMethod(id) {
    const current = await getMethodById(id);
    if (!current) {
        const err = new Error("Payment method not found");
        err.statusCode = 404;
        throw err;
    }
    if (current.method !== "merchant") {
        const err = new Error("Only merchant payment methods can be deleted. Disable bKash/Nagad instead.");
        err.statusCode = 400;
        throw err;
    }

    const [refs] = await db.query(
        `SELECT id FROM deposit_requests WHERE payment_method_id = ? LIMIT 1`,
        [id]
    );
    if (refs.length) {
        const err = new Error("This merchant is used by existing deposits and cannot be deleted. Disable it instead.");
        err.statusCode = 409;
        throw err;
    }

    await db.query(`DELETE FROM deposit_payment_methods WHERE id = ?`, [id]);
    return { deleted: true, id };
}

module.exports = {
    listMethods,
    getActiveMethods,
    getMethodById,
    createMethod,
    updateMethod,
    toggleMethod,
    deleteMethod,
};
