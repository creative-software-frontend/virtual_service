module.exports = async (db) => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS packages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                duration_days INT NOT NULL DEFAULT 30,
                duration_months INT NOT NULL DEFAULT 1,
                tier_type VARCHAR(20) NOT NULL DEFAULT 'premium',
                features TEXT,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check and add balance/earnings columns to users
        const [userCols] = await db.query(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'"
        );
        const colNames = userCols.map(c => c.COLUMN_NAME.toLowerCase());
        if (!colNames.includes("balance")) {
            await db.query("ALTER TABLE users ADD COLUMN balance DECIMAL(15,2) DEFAULT 0.00");
            console.log("Added balance column to users table");
        }
        if (!colNames.includes("earnings")) {
            await db.query("ALTER TABLE users ADD COLUMN earnings DECIMAL(15,2) DEFAULT 0.00");
            console.log("Added earnings column to users table");
        }

        // Create transactions table
        await db.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type ENUM('deposit', 'withdraw', 'earning') NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                status VARCHAR(20) DEFAULT 'completed',
                description VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Transactions table setup verified");

        console.log("DB initialized successfully");
    } catch (err) {
        console.error("DB init error:", err.message);
    }
};