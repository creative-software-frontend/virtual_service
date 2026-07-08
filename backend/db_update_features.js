const db = require("./src/config/db");

async function updateFeatures() {
    console.log("Updating database features...");
    try {
        // 1. Insert PARTNER_SEARCH if not exists
        await db.query(`
            INSERT IGNORE INTO features (feature_key, description)
            VALUES ('PARTNER_SEARCH', 'Basic search functionality')
        `);

        // 2. Define the matrix
        const matrix = {
            'starter': ['PARTNER_SEARCH', 'PROFILE_VIEW_FULL', 'CHAT'],
            'premium': ['PARTNER_SEARCH', 'PROFILE_VIEW_FULL', 'CHAT', 'ADVANCED_SEARCH', 'AUDIO_CALL', 'VIDEO_CALL'],
            'elite': ['PARTNER_SEARCH', 'PROFILE_VIEW_FULL', 'CHAT', 'ADVANCED_SEARCH', 'AUDIO_CALL', 'VIDEO_CALL', 'PRIORITY_MATCHING', 'PREMIUM_BADGE', 'EVENT_ACCESS', 'VIP_SUPPORT']
        };

        // 3. Delete existing package_features to prevent duplicates
        await db.query(`DELETE FROM package_features`);

        // 4. Insert new package_features
        for (const [tier, keys] of Object.entries(matrix)) {
            for (const key of keys) {
                // Ensure feature exists first
                await db.query(`
                    INSERT IGNORE INTO features (feature_key, description)
                    VALUES (?, ?)
                `, [key, 'Feature ' + key]);

                await db.query(`
                    INSERT INTO package_features (package_tier_type, feature_key)
                    VALUES (?, ?)
                `, [tier, key]);
            }
        }
        
        console.log("Database features updated successfully.");
    } catch (e) {
        console.error("Failed to update db features:", e);
    } finally {
        db.end();
    }
}

updateFeatures();
