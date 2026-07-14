const db = require("../config/db");

// Map the UI/middleware feature aliases to the canonical feature_key values
// stored in the `features` table. The DB uses lowercase, scoped keys
// (e.g. "basic_chat", "partner_search") while some call sites pass the
// legacy uppercase names (e.g. "CHAT", "PARTNER_SEARCH").
// NOTE: provider-scoped keys like "EVENT_ACCESS" are intentionally left
// untouched so provider functionality is never broken.
const FEATURE_ALIASES = {
  CHAT: "basic_chat",
  PARTNER_SEARCH: "partner_search",
  ADVANCED_SEARCH: "advanced_search_filter",
};

function normalizeFeatureName(featureName) {
  if (!featureName) return null;
  const s = String(featureName).trim();
  if (!s) return null;
  return FEATURE_ALIASES[s] || s;
}

function membershipNoMembership() {
  return { statusCode: 403, message: "This feature requires membership" };
}

function membershipExpired() {
  return { statusCode: 403, message: "Membership expired" };
}

function membershipLocked() {
  return { statusCode: 403, message: "Upgrade membership to access this feature" };
}

async function checkFeatureAccess(userId, featureName) {
  const f = normalizeFeatureName(featureName);
  if (!f) return { allowed: false, ...membershipLocked() };

  // Load membership
  const [userRows] = await db.query(
    "SELECT membership_package_id, membership_expires_at FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  if (!userRows || userRows.length === 0) return { allowed: false, ...membershipNoMembership() };
  const u = userRows[0];

  if (!u.membership_package_id || !u.membership_expires_at) {
    return { allowed: false, ...membershipNoMembership() };
  }

  const expiresAt = new Date(u.membership_expires_at);
  const now = new Date();
  if (!Number.isFinite(expiresAt.getTime()) || expiresAt.getTime() < now.getTime()) {
    return { allowed: false, ...membershipExpired() };
  }

  // Get current package tier_type
  const [pkgRows] = await db.query(
    "SELECT tier_type FROM packages WHERE id = ? AND is_active = 1 LIMIT 1",
    [u.membership_package_id]
  );

  const tierType = pkgRows?.[0]?.tier_type ? String(pkgRows[0].tier_type) : null;
  if (!tierType) return { allowed: false, ...membershipLocked() };

  // Feature key must match DB features.feature_key exactly.
  // Normalization is limited to trimming only.
  const dbFeatureKey = f;




  // DB-driven: check whether this feature is enabled for the user's selected package.
  const [pfRows] = await db.query(
    `SELECT 1
     FROM package_features pf
     JOIN features f ON f.id = pf.feature_id
     WHERE pf.package_id = ?
       AND f.feature_key = ?
     LIMIT 1`,
    [u.membership_package_id, dbFeatureKey]
  );

  return pfRows && pfRows.length ? { allowed: true } : { allowed: false, ...membershipLocked() };
}

function requireFeature(featureName) {
  const f = normalizeFeatureName(featureName);
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      // Membership restrictions apply ONLY to role = 'user'.
      // Admins and providers bypass all membership checks.
      if (req.user?.role === "admin" || req.user?.role === "provider") return next();

      const result = await checkFeatureAccess(userId, f);
      if (!result.allowed) {
        return res.status(result.statusCode || 403).json({ message: result.message });
      }

      return next();
    } catch (err) {
      return res.status(500).json({ message: err.message || "Membership check failed" });
    }
  };
}

/**
 * Middleware to fallback expired memberships to FREE on every request.
 */
async function membershipExpiryMiddleware(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return next();

    const [rows] = await db.query(
      "SELECT membership_package_id, membership_expires_at FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (!rows || rows.length === 0) return next();

    const u = rows[0];
    if (!u.membership_package_id || !u.membership_expires_at) return next();

    const expiresAt = new Date(u.membership_expires_at);
    const now = new Date();

    if (Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() < now.getTime()) {
      await db.query(
        "UPDATE users SET membership_package_id = NULL, membership_started_at = NULL, membership_expires_at = NULL WHERE id = ?",
        [userId]
      );
    }

    return next();
  } catch (err) {
    return next();
  }
}

module.exports = {
  checkFeatureAccess,
  requireFeature,
  membershipExpiryMiddleware,
};



