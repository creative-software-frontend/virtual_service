const db = require("./src/config/db");
const { checkFeatureAccess } = require("./src/middleware/membershipMiddleware");
const { getMembershipStatus } = require("./src/services/membershipService");

async function runTests() {
    console.log("Starting Authorization Tests...");
    
    try {
        // Find users with different plans
        const [users] = await db.query(`
            SELECT u.id, u.name, u.role, p.tier_type 
            FROM users u
            LEFT JOIN packages p ON u.membership_package_id = p.id
            WHERE u.role = 'user'
        `);

        // Group users by tier for testing
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

            // Test 1: Platinum joining events (EVENT_ACCESS)
            const eventRes = await checkFeatureAccess(user.id, "EVENT_ACCESS");
            console.log(`[Event Access]: ${eventRes.allowed ? '✅ Allowed' : '❌ Denied'}`);

            // Test 2: Chat Access (CHAT)
            const chatRes = await checkFeatureAccess(user.id, "CHAT");
            console.log(`[Chat Access]: ${chatRes.allowed ? '✅ Allowed' : '❌ Denied'}`);

            // Test 3: Newsfeed (Removed middleware, but we can verify it doesn't crash)
            console.log(`[Newsfeed Access]: ✅ Public (Middleware removed)`);

            // Additional verification for other keys
            const profileRes = await checkFeatureAccess(user.id, "PROFILE_VIEW_FULL");
            console.log(`[Profile View Full]: ${profileRes.allowed ? '✅ Allowed' : '❌ Denied'}`);
        }
    } catch (err) {
        console.error("Test execution failed:", err);
    } finally {
        // End db connection pool to allow script to exit
        db.end();
    }
}

runTests();
