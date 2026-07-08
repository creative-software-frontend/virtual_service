const db = require("../config/db");

const PACKAGE_TIER_TO_ENABLED_FEATURES = {
  starter: [
    // FREE
    "partner_search",
    "chat",
    // but we will treat them as disabled in access mapping for free
  ],
  premium: [
    "partner_search",
    "chat",
  ],
  elite: [
    "partner_search",
    "chat",
    "priority_matching",
    "verified_badge",
    "tour_access",
    // coming soon features are enabled but available=false in middleware
    "audio_call",
    "video_call",
    "advanced_search",
    "vip_support",
  ],
};

function getNow() {
  return new Date();
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(days));
  return d;
}

async function getWalletBalanceForUser(connection, userId) {
  const [rows] = await connection.query("SELECT balance FROM users WHERE id = ? LIMIT 1", [userId]);
  if (!rows.length) return null;
  return Number(rows[0].balance || 0);
}

async function buyMembership({ userId, packageId }) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Lock user row
    const [userRows] = await connection.query(
      "SELECT id, balance FROM users WHERE id = ? FOR UPDATE",
      [userId]
    );
    if (!userRows.length) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const user = userRows[0];

    const [pkgRows] = await connection.query(
      "SELECT id, price, duration_days, tier_type FROM packages WHERE id = ? AND is_active = 1 LIMIT 1 FOR UPDATE",
      [packageId]
    );
    if (!pkgRows.length) {
      const err = new Error("Membership package not found");
      err.statusCode = 404;
      throw err;
    }

    const pkg = pkgRows[0];
    const price = Number(pkg.price || 0);
    const durationDays = Number(pkg.duration_days || 0);

    const walletBalance = Number(user.balance || 0);

    if (price > 0 && walletBalance < price) {
      const err = new Error("Insufficient wallet balance.");
      err.statusCode = 409;
      throw err;
    }

    // Deduct wallet balance if price > 0
    if (price > 0) {
      await connection.query("UPDATE users SET balance = balance - ? WHERE id = ?", [price, userId]);
    }

    const now = getNow();

    // Renewal / upgrade: new_expiration = MAX(current_expiration, NOW()) + duration_days
    const [current] = await connection.query(
      "SELECT membership_package_id, membership_expires_at FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    const currentExpiresAt = current?.[0]?.membership_expires_at ? new Date(current[0].membership_expires_at) : null;
    const baseDate = currentExpiresAt && currentExpiresAt.getTime() > now.getTime() ? currentExpiresAt : now;
    const newExpiresAt = addDays(baseDate, durationDays);

    // Activate membership on user immediately
    await connection.query(
      "UPDATE users SET membership_package_id = ?, membership_started_at = ?, membership_expires_at = ? WHERE id = ?",
      [packageId, now, newExpiresAt, userId]
    );


    // Transaction record (atomic)
    await connection.query(
      `INSERT INTO transactions (user_id, type, amount, status, description)
       VALUES (?, 'membership_purchase', ?, 'completed', ?)` ,
      [userId, -price, `Membership Purchase - ${pkg.tier_type.charAt(0).toUpperCase() + pkg.tier_type.slice(1)}`]
    );

    await connection.commit();

    return {
      user_id: userId,
      package_id: pkg.id,
      tier_type: pkg.tier_type,
      price,
      membership_started_at: now,
      membership_expires_at: newExpiresAt,
    };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function getMembershipStatus(userId) {
  const [rows] = await db.query(
    "SELECT membership_package_id, membership_started_at, membership_expires_at FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  if (!rows.length) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const u = rows[0];

  // NOTE: expiry middleware should already clear expired memberships.
  // Still compute for UI safety.
  const expiresAt = u.membership_expires_at ? new Date(u.membership_expires_at) : null;
  const now = new Date();
  const isExpired = expiresAt ? expiresAt.getTime() < now.getTime() : false;
  const days_remaining = !expiresAt || isExpired ? 0 : Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));


  if (!u.membership_package_id || !u.membership_expires_at || isExpired) {
    return {
      plan: "free",
      expires_at: null,
      days_remaining: 0,
      wallet_balance: null,
      features: {
        partner_search: { enabled: false, available: false, message: "Locked" },
        chat: { enabled: false, available: false, message: "Locked" },
        audio_call: { enabled: false, available: false, message: "Locked" },
        video_call: { enabled: false, available: false, message: "Locked" },
        advanced_search: { enabled: false, available: false, message: "Locked" },
        vip_support: { enabled: false, available: false, message: "Locked" },
        priority_matching: { enabled: false, available: false, message: "Locked" },
        verified_badge: { enabled: false, available: false, message: "Locked" },
        tour_access: { enabled: false, available: false, message: "Locked" },
      }
    };

  }

  const [pkgRows] = await db.query(
    "SELECT id, tier_type, price, duration_days FROM packages WHERE id = ? LIMIT 1",
    [u.membership_package_id]
  );

  const pkg = pkgRows?.[0];
  const tier = pkg?.tier_type || "starter";

  // UI contract required by task: features.<name> = { enabled, available, message }
  const wallet_balance = await db.query("SELECT balance FROM users WHERE id = ? LIMIT 1", [userId]).then(r => r?.[0]?.[0]?.balance ?? 0);

  const isComingSoon = (name) => ["audio_call", "video_call", "advanced_search", "vip_support"].includes(name);

  const plan = tier === "elite" ? "platinum" : tier === "premium" ? "gold" : "free";

  const enabled = {
    partner_search: tier !== "starter",
    chat: tier !== "starter",
    priority_matching: tier === "elite",
    verified_badge: tier === "elite",
    tour_access: tier === "elite",
    audio_call: tier === "elite",
    video_call: tier === "elite",
    advanced_search: tier === "elite",
    vip_support: tier === "elite",
  };

  const features = {};
  for (const [name, ok] of Object.entries(enabled)) {
    features[name] = ok
      ? isComingSoon(name)
        ? { enabled: true, available: false, message: "Coming Soon" }
        : { enabled: true, available: true, message: "Enabled" }
      : { enabled: false, available: false, message: "Locked" };
  }

  return {
    plan,
    expires_at: u.membership_expires_at,
    days_remaining,
    wallet_balance: Number(wallet_balance),
    features,
  };

}

module.exports = {
  buyMembership,
  getMembershipStatus,
};

