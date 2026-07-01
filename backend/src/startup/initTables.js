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

        // Check and add profile/balance/earnings columns to users
        const [userCols] = await db.query(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'"
        );
        const colNames = userCols.map(c => c.COLUMN_NAME.toLowerCase());

        // Wallet columns
        if (!colNames.includes("balance")) {
            await db.query("ALTER TABLE users ADD COLUMN balance DECIMAL(15,2) DEFAULT 0.00");
            console.log("Added balance column to users table");
        }
        if (!colNames.includes("earnings")) {
            await db.query("ALTER TABLE users ADD COLUMN earnings DECIMAL(15,2) DEFAULT 0.00");
            console.log("Added earnings column to users table");
        }

        // Profile columns (nullable)
        const profileColumns = [
            { name: 'gender', type: "VARCHAR(50) NULL" },
            { name: 'date_of_birth', type: "DATE NULL" },
            { name: 'profession', type: "VARCHAR(100) NULL" },
            { name: 'education', type: "VARCHAR(150) NULL" },
            { name: 'location', type: "VARCHAR(150) NULL" },
            { name: 'bio', type: "TEXT NULL" },
            { name: 'interests', type: "TEXT NULL" },
            { name: 'relationship_goal', type: "VARCHAR(100) NULL" },
            { name: 'marital_status', type: "VARCHAR(100) NULL" },
            { name: 'avatar_url', type: "TEXT NULL" },
        ];

        // Ensure any missing columns exist; keeps backward compatibility
        for (const col of profileColumns) {
            if (!colNames.includes(col.name.toLowerCase())) {
                await db.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
                console.log(`Added ${col.name} column to users table`);
            }
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("Transactions table setup verified");

        await db.query(`
            CREATE TABLE IF NOT EXISTS deposit_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                method VARCHAR(20) NOT NULL,
                trx_id VARCHAR(100) NOT NULL UNIQUE,
                screenshot_url TEXT NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                admin_note TEXT,
                approved_by INT NULL,
                approved_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS withdraw_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                method VARCHAR(20) NOT NULL,
                account_number VARCHAR(100) NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                admin_note TEXT,
                approved_by INT NULL,
                approved_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log("Manual payment request tables setup verified");

        // Create events table
        await db.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                date_time DATETIME NOT NULL,
                location VARCHAR(255) NOT NULL,
                capacity INT NOT NULL DEFAULT 0,
                creator_id INT NOT NULL,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                host_name VARCHAR(150) NULL,
                application_deadline DATETIME NULL,
                entry_fee DECIMAL(10,2) DEFAULT 0
            )
        `);

        // Backward-compatible column adds (in case events table existed earlier)
        const [eventCols] = await db.query(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events'"
        );
        const eventColNames = eventCols.map(c => c.COLUMN_NAME.toLowerCase());

        if (!eventColNames.includes('host_name')) {
            await db.query("ALTER TABLE events ADD COLUMN host_name VARCHAR(150) NULL");
        }
        if (!eventColNames.includes('application_deadline')) {
            await db.query("ALTER TABLE events ADD COLUMN application_deadline DATETIME NULL");
        }
        if (!eventColNames.includes('entry_fee')) {
            await db.query("ALTER TABLE events ADD COLUMN entry_fee DECIMAL(10,2) DEFAULT 0");
        }

        console.log("Events table setup verified");


        // Create event participants table
        await db.query(`
            CREATE TABLE IF NOT EXISTS event_participants (
                event_id INT NOT NULL,
                user_id INT NOT NULL,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (event_id, user_id)
            )
        `);
        console.log("Event participants table setup verified");

        // Create match requests table
        await db.query(`
            CREATE TABLE IF NOT EXISTS match_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_match_requests_sender (sender_id),
                INDEX idx_match_requests_receiver (receiver_id),
                INDEX idx_match_requests_status (status)
            )
        `);
        console.log("Match requests table setup verified");

        console.log("DB initialized successfully");
    } catch (err) {
        console.error("DB init error:", err.message);
    }
};