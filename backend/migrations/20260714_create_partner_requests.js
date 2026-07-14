/**
 * Create the partner_requests table.
 *
 * This is the USER → PROVIDER partner request workflow, distinct from the
 * existing match_requests (user↔user) table. A partner request lets a USER
 * ask a PROVIDER to connect. Once the provider ACCEPTS:
 *   - chat is unlocked between the two (subject to membership for users)
 *   - both sides get full profile visibility
 *
 * status values: pending | accepted | rejected | cancelled
 *
 * The UNIQUE KEY (user_id, provider_id) prevents a user from sending
 * duplicate active requests to the same provider.
 */

module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS partner_requests (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL,
        provider_id INT NOT NULL,
        status      ENUM('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending',
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_partner_user_provider (user_id, provider_id),
        CONSTRAINT fk_pr_user     FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_pr_provider FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  },

  down: async (db) => {
    await db.query(`DROP TABLE IF EXISTS partner_requests`);
  },
};
