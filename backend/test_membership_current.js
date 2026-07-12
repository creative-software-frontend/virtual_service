// Quick test of the new /api/user/membership/current endpoint logic
const db = require("./src/config/db");
const { getCurrentMembership } = require("./src/services/membershipService");
const { checkFeatureAccess } = require("./src/middleware/membershipMiddleware");

// Feature permissions expected per tier
const EXPECTED = {
    free:     { PARTNER_SEARCH: false, CHAT: false, ADVANCED_SEARCH: false, EVENT_ACCESS: false },
    starter:  { PARTNER_SEARCH: true,  CHAT: true,  ADVANCED_SEARCH: false, EVENT_ACCESS: false },
    premium:  { PARTNER_SEARCH: true,  CHAT: true,  ADVANCED_SEARCH: true,  EVENT_ACCESS: false },
    elite:    { PARTNER_SEARCH: true,  CHAT: true,  ADVANCED_SEARCH: true,  EVENT_ACCESS: true  },
};

async function runTests() {
    console.log("\n=== Frontend /current API Simulation ===\n");

    const [users] = await db.query(`
        SELECT u.id, u.name, p.tier_type
        FROM users u
        LEFT JOIN packages p ON u.membership_package_id = p.id
        WHERE u.role = 'user'
    `);

    const testUsers = {
        free:    users.find(u => !u.tier_type),
        starter: users.find(u => u.tier_type === 'starter'),
        premium: users.find(u => u.tier_type === 'premium'),
        elite:   users.find(u => u.tier_type === 'elite'),
    };

    for (const [label, user] of Object.entries(testUsers)) {
        const tier = label;
        const expected = EXPECTED[tier];

        if (!user) {
            console.log(`[WARN] No user found for tier: ${tier}`);
            continue;
        }

        console.log(`--- ${tier.toUpperCase()} user (ID: ${user.id}) ---`);

        const current = await getCurrentMembership(user.id);
        console.log(`  Package : ${current.package}`);
        console.log(`  Expires : ${current.expires_at || 'N/A'}`);
        console.log(`  Features: [${current.features.join(', ')}]`);

        let allPassed = true;
        for (const [feat, shouldHave] of Object.entries(expected)) {
            const hasIt = current.features.includes(feat);
            const pass = hasIt === shouldHave;
            if (!pass) allPassed = false;
            const sym = pass ? '✅' : '❌';
            console.log(`  ${sym} ${feat}: ${hasIt ? 'Allowed' : 'Denied'} (expected ${shouldHave ? 'Allowed' : 'Denied'})`);
        }

        console.log(`  Overall: ${allPassed ? '✅ PASS' : '❌ FAIL'}\n`);
    }

    db.end();
}

runTests().catch(e => { console.error(e); db.end(); });
