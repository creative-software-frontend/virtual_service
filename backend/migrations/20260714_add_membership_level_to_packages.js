/**
 * Add membership_level to the packages table.
 *
 * The membership hierarchy must be database-driven and independent of
 * package id / name / price (those change when packages are deleted
 * and recreated). membership_level is an integer that defines the
 * position of a package in the hierarchy:
 *
 *   Silver    -> 1
 *   Gold      -> 2
 *   Platinum  -> 3
 *
 * Provider packages reuse the same scale:
 *   Provider Starter -> 1
 *   Provider Premium  -> 2
 *   Provider Elite    -> 3
 *
 * Future packages (Diamond, Enterprise, VIP, ...) simply get a higher
 * membership_level value in the database — no backend code changes needed.
 */

module.exports = {
  up: async (db) => {
    // 1. Add the column (idempotent — ignore error if it already exists).
    await db.query(`
      ALTER TABLE packages
      ADD COLUMN membership_level INT NOT NULL DEFAULT 1;
    `).catch(() => { /* column already exists */ });

    // 2. Backfill existing rows based on their tier_type so the
    //    hierarchy is correct for data created before this migration.
    await db.query(`
      UPDATE packages
      SET membership_level = CASE
        WHEN tier_type = 'silver'  THEN 1
        WHEN tier_type = 'Gold'    THEN 2
        WHEN tier_type = 'premium' THEN 3   -- Platinum package uses tier_type 'premium'
        WHEN tier_type = 'starter' THEN 1
        WHEN tier_type = 'elite'   THEN 3
        ELSE 1
      END;
    `);
  },

  down: async (db) => {
    await db.query(`
      ALTER TABLE packages
      DROP COLUMN membership_level;
    `).catch(() => { /* column already gone */ });
  }
};
