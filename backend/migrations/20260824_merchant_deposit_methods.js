/**
 * Merchant deposit payment method support.
 *
 * 1. deposit_payment_methods gains merchant configuration columns:
 *      provider_name          display name shown to users (e.g. "bKash Merchant")
 *      instructions           free-text payment instructions
 *      instruction_image_url  optional uploaded instruction image (/uploads/... or https://...)
 *    `account_type` becomes NULLable: bkash/nagad rows keep 'personal' | 'agent',
 *    while merchant rows store NULL. The existing UNIQUE KEY
 *    uq_dpm_method_type (method, account_type) therefore keeps enforcing
 *    one row per bkash/nagad type, but allows multiple merchant rows,
 *    because MySQL unique indexes permit multiple NULL values.
 *    The "at most one ACTIVE row per method" invariant is enforced in
 *    depositPaymentService (deactivateOthers) and applies to merchant too.
 *
 * 2. deposit_requests gains a historical snapshot of the merchant details that
 *    were actually used when a Merchant deposit was submitted, so later admin
 *    edits to the merchant configuration never rewrite history:
 *      payment_method_id                 reference to the deposit_payment_methods row used
 *      merchant_provider_name            snapshot of provider_name
 *      merchant_account_number           snapshot of account_number
 *      merchant_instructions             snapshot of instructions
 *      merchant_instruction_image_url    snapshot of instruction_image_url
 *
 * Guarded via information_schema so it is idempotent: safe on a fresh database,
 * an existing database with live deposit data, an already-upgraded database,
 * and repeated runs / backend restarts.
 */

module.exports = {
    up: async (db) => {
        const columnExists = async (table, column) => {
            const [rows] = await db.query(
                "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                [table, column]
            );
            return rows.length > 0;
        };
        const ensureColumn = async (table, column, ddl) => {
            if (!(await columnExists(table, column))) {
                await db.query(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
            }
        };

        // ── 1. deposit_payment_methods ────────────────────────────────────────

        // account_type must be nullable so merchant rows can store NULL and
        // bypass the (method, account_type) unique key. Existing bkash/nagad
        // data ('personal'/'agent') is untouched.
        const [acctTypeCol] = await db.query(
            "SELECT IS_NULLABLE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'deposit_payment_methods' AND COLUMN_NAME = 'account_type'"
        );
        if (acctTypeCol.length && acctTypeCol[0].IS_NULLABLE === 'NO') {
            await db.query(
                "ALTER TABLE deposit_payment_methods MODIFY account_type VARCHAR(10) NULL DEFAULT 'personal'"
            );
        }

        await ensureColumn('deposit_payment_methods', 'provider_name', 'provider_name VARCHAR(100) NULL');
        await ensureColumn('deposit_payment_methods', 'instructions', 'instructions TEXT NULL');
        await ensureColumn('deposit_payment_methods', 'instruction_image_url', 'instruction_image_url VARCHAR(500) NULL');

        // ── 2. deposit_requests (historical merchant snapshot) ───────────────

        await ensureColumn('deposit_requests', 'payment_method_id', 'payment_method_id INT NULL');
        await ensureColumn('deposit_requests', 'merchant_provider_name', 'merchant_provider_name VARCHAR(100) NULL');
        await ensureColumn('deposit_requests', 'merchant_account_number', 'merchant_account_number VARCHAR(30) NULL');
        await ensureColumn('deposit_requests', 'merchant_instructions', 'merchant_instructions TEXT NULL');
        await ensureColumn('deposit_requests', 'merchant_instruction_image_url', 'merchant_instruction_image_url VARCHAR(500) NULL');

        const indexExists = async (table, index) => {
            const [rows] = await db.query(
                "SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?",
                [table, index]
            );
            return rows.length > 0;
        };
        if (!(await indexExists('deposit_requests', 'idx_deposit_requests_payment_method'))) {
            await db.query(
                'CREATE INDEX idx_deposit_requests_payment_method ON deposit_requests(payment_method_id)'
            );
        }
    },

    down: async (db) => {
        const indexExists = async (table, index) => {
            const [rows] = await db.query(
                "SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?",
                [table, index]
            );
            return rows.length > 0;
        };
        if (await indexExists('deposit_requests', 'idx_deposit_requests_payment_method')) {
            await db.query('DROP INDEX idx_deposit_requests_payment_method ON deposit_requests');
        }

        const dropColumnIfExists = async (table, column) => {
            const [rows] = await db.query(
                "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                [table, column]
            );
            if (rows.length > 0) {
                await db.query(`ALTER TABLE ${table} DROP COLUMN ${column}`);
            }
        };

        await dropColumnIfExists('deposit_requests', 'merchant_instruction_image_url');
        await dropColumnIfExists('deposit_requests', 'merchant_instructions');
        await dropColumnIfExists('deposit_requests', 'merchant_account_number');
        await dropColumnIfExists('deposit_requests', 'merchant_provider_name');
        await dropColumnIfExists('deposit_requests', 'payment_method_id');

        await dropColumnIfExists('deposit_payment_methods', 'instruction_image_url');
        await dropColumnIfExists('deposit_payment_methods', 'instructions');
        await dropColumnIfExists('deposit_payment_methods', 'provider_name');

        // Restore account_type NOT NULL only if no merchant (NULL) rows remain.
        const [nullRows] = await db.query(
            "SELECT id FROM deposit_payment_methods WHERE account_type IS NULL LIMIT 1"
        );
        if (!nullRows.length) {
            await db.query(
                "ALTER TABLE deposit_payment_methods MODIFY account_type VARCHAR(10) NOT NULL DEFAULT 'personal'"
            );
        }
    },
};
