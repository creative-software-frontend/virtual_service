const db = require("./src/config/db");
const { checkFeatureAccess } = require("./src/middleware/membershipMiddleware");

async function runTests() {
    console.log("Starting Feature Matrix Tests...");
    
    try {
        const [users] = await db.query(`
            SELECT u.id, u.name, u.role, p.tier_type 
            FROM users u
            LEFT JOIN packages p ON u.membership_package_id = p.id
            WHERE u.role = 'user'
        `);

        const testUsers = {
            free: users.find(u => !u.tier_type),
            silver: users.find(u => u.tier_type === 'starter'),
            gold: users.find(u => u.tier_type === 'premium'),
            platinum: users.find(u => u.tier_type === 'elite')
        };

        for (const [tier, user] of Object.entries(testUsers)) {
            if (!user) {
                console.log(`[WARN] No user found for tier: ${tier}`);
                continue;
            }

            console.log(`\n--- Testing ${tier.toUpperCase()} User (ID: ${user.id}) ---`);

            const partnerRes = await checkFeatureAccess(user.id, "PARTNER_SEARCH");
            console.log(`[Partner Search]: ${partnerRes.allowed ? '✅ Allowed' : '❌ Denied'}`);

            const advancedRes = await checkFeatureAccess(user.id, "ADVANCED_SEARCH");
            console.log(`[Advanced Search]: ${advancedRes.allowed ? '✅ Allowed' : '❌ Denied'}`);

            const eventRes = await checkFeatureAccess(user.id, "EVENT_ACCESS");
            console.log(`[Event Access]: ${eventRes.allowed ? '✅ Allowed' : '❌ Denied'}`);
        }
    } catch (err) {
        console.error("Test execution failed:", err);
    } finally {
        db.end();
    }
}

runTests();
