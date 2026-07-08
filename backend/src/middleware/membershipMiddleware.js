const db = require("../config/db");

const FEATURE_MAP = {
  // partner search + chat access
  partner_search: { dependsOn: "partner_search", comingSoon: false },
  chat: { dependsOn: "chat", comingSoon: false },

  // chat extras
  audio_call: { dependsOn: "audio_call", comingSoon: true },
  video_call: { dependsOn: "video_call", comingSoon: true },
  advanced_search: { dependsOn: "advanced_search", comingSoon: true },

  // premium extras
  priority_matching: { dependsOn: "priority_matching", comingSoon: false },
  verified_badge: { dependsOn: "verified_badge", comingSoon: false },
  tour_access: { dependsOn: "tour_access", comingSoon: false },
  vip_support: { dependsOn: "vip_support", comingSoon: true },
};

const PACKAGE_TO_FEATURES = {
  starter: {
    partner_search: false,
    chat: false,
    priority_matching: false,
    verified_badge: false,
    tour_access: false,
    audio_call: false,
    video_call: false,
    advanced_search: false,
    vip_support: false,
  },
  premium: {
    partner_search: true,
    chat: true,
    priority_matching: false,
    verified_badge: false,
    tour_access: false,
    audio_call: false,
    video_call: false,
    advanced_search: false,
    vip_support: false,
  },
  elite: {
    partner_search: true,
    chat: true,
    priority_matching: true,
    verified_badge: true,
    tour_access: true,
    audio_call: false,
    video_call: false,
    advanced_search: false,
    vip_support: false,
  },
};

function normalizeFeatureName(featureName) {
  if (!featureName) return null;
  const s = String(featureName).trim();
  if (!s) return null;
  return s;
}

function getComingSoonMeta(featureName) {
  const meta = FEATURE_MAP[featureName];
  return meta || { comingSoon: true };
}

async function getActiveMembershipForUser(userId, connection = null) {
  const q = (sql, params) => (connection ? connection.query(sql, params) : db.query(sql, params));

  // Locking is not required for read-only helper; use a single query.
  const [rows] = await q(
    "SELECT id, membership_package_id, membership_expires_at FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  if (!rows || rows.length === 0) {
    return { packageTier: "starter", membership: null };
  }

  const membership = rows[0];
  if (!membership.membership_package_id || !membership.membership_expires_at) {
    return { packageTier: "starter", membership };
  }

  // Expired fallback to FREE
  const expiresAt = new Date(membership.membership_expires_at);
  const now = new Date();
  if (Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() < now.getTime()) {
    return { packageTier: "starter", membership };
  }

  const [pkgRows] = await q(
    "SELECT tier_type FROM packages WHERE id = ? LIMIT 1",
    [membership.membership_package_id]
  );

  const tier = pkgRows && pkgRows.length ? String(pkgRows[0].tier_type) : "starter";
  return { packageTier: tier, membership };
}

async function hasFeature(userId, featureName) {
  const f = normalizeFeatureName(featureName);
  if (!f) return false;

  const { packageTier } = await getActiveMembershipForUser(userId);
  const tierFeatures = PACKAGE_TO_FEATURES[packageTier] || PACKAGE_TO_FEATURES.starter;

  // Coming-soon features are considered enabled if membership owns them, but available=false.
  // Our mapping treats them as belonging to premium tiers only when explicitly enabled in spec.
  // Here: audio/video/advanced/vip are Coming Soon and should be enabled if user owns membership >= GOLD/PLATINUM.

  if (f === "audio_call" || f === "video_call" || f === "advanced_search") {
    // GOLD (elite in current system) in your mapping requirements enables audio/video/advanced.
    // Our existing tier_type mapping uses premium for SILVER and elite for GOLD+PLATINUM bundle.
    // To match spec without redesign, we treat elite as enabling all Gold features.
    return packageTier === "elite";
  }

  if (f === "vip_support") {
    // PLATINUM should have vip_support. We approximate: elite tier_type means premium+elite plans.
    // Since current system only has 3 tiers (starter/premium/elite), elite is treated as PLATINUM.
    return packageTier === "elite";
  }

  return !!tierFeatures[f];
}

function comingSoonResponse(featureName) {
  return {
    enabled: true,
    available: false,
    message: "Coming Soon",
  };
}

function okResponse(featureName) {
  return {
    enabled: true,
    available: true,
    message: "Enabled",
  };
}

function noAccessResponse() {
  return {
    enabled: false,
    available: false,
    message: "Locked",
  };
}

function requireFeature(featureName) {
  const f = normalizeFeatureName(featureName);
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const enabled = await hasFeature(userId, f);
      if (!enabled) return res.status(403).json(noAccessResponse());

      // If coming-soon feature: available=false but enabled=true.
      const meta = getComingSoonMeta(f);
      if (meta.comingSoon) return res.status(200).json(comingSoonResponse(f));

      // Feature enabled and available
      return next();
    } catch (err) {
      return res.status(500).json({ message: err.message || "Membership check failed" });
    }
  };
}

/**
 * Middleware to fallback expired memberships to FREE on every request.
 * - Clears membership fields if expired.
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
    // Do not block requests on membership expiry check failure.
    return next();
  }
}

module.exports = {
  hasFeature,
  requireFeature,
  membershipExpiryMiddleware,
};

