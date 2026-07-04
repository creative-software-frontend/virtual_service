/**
 * Add request_id columns to wallet requests tables (deposit_requests, withdraw_requests)
 * - request_id is unique per table
 */

module.exports = {
  up: async (db) => {
    await db.query(`
      ALTER TABLE deposit_requests
      ADD COLUMN request_id VARCHAR(64) NULL;
    `);

    await db.query(`
      ALTER TABLE withdraw_requests
      ADD COLUMN request_id VARCHAR(64) NULL;
    `);

    // Best-effort unique constraints. If the DB supports creating indexes, use indexes.
    await db.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS deposit_requests_request_id_unique
      ON deposit_requests(request_id);
    `);

    await db.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS withdraw_requests_request_id_unique
      ON withdraw_requests(request_id);
    `);
  },

  down: async (db) => {
    await db.query(`
      DROP INDEX IF EXISTS deposit_requests_request_id_unique;
    `);

    await db.query(`
      DROP INDEX IF EXISTS withdraw_requests_request_id_unique;
    `);

    await db.query(`
      ALTER TABLE deposit_requests
      DROP COLUMN request_id;
    `);

    await db.query(`
      ALTER TABLE withdraw_requests
      DROP COLUMN request_id;
    `);
  }
};

