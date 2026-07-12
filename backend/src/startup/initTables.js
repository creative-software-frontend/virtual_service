module.exports = async (db) => {
    try {
        // ─── Helper: safely add a named FK only if it doesn't already exist ───
        const addFKIfNotExists = async (table, constraintName, column, refTable, refCol, onDelete = 'CASCADE') => {
            try {
                const [rows] = await db.query(
                    `SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
                     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?`,
                    [table, constraintName]
                );
                if (!rows.length) {
                    await db.query(
                        `ALTER TABLE \`${table}\` ADD CONSTRAINT \`${constraintName}\`
                         FOREIGN KEY (\`${column}\`) REFERENCES \`${refTable}\`(\`${refCol}\`) ON DELETE ${onDelete}`
                    );
                    console.log(`✅ FK added: ${constraintName}`);
                }
            } catch (e) {
                console.warn(`⚠️  FK skipped (${constraintName}):`, e?.message);
            }
        };

        // ════════════════════════════════════════════════════════════
        // 1. packages  — no dependencies
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS packages (
                id            INT AUTO_INCREMENT PRIMARY KEY,
                name          VARCHAR(100)    NOT NULL,
                description   TEXT,
                price         DECIMAL(10,2)   NOT NULL,
                duration_days INT             NOT NULL DEFAULT 30,
                duration_months INT           NOT NULL DEFAULT 1,
                tier_type     VARCHAR(20)     NOT NULL DEFAULT 'premium',
                features      TEXT,
                is_active     TINYINT(1)      NOT NULL DEFAULT 1,
                created_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('packages table verified');

        // ════════════════════════════════════════════════════════════
        // 2. features  — no dependencies
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS features (
                feature_key VARCHAR(100) PRIMARY KEY,
                description VARCHAR(255)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('features table verified');

        // ════════════════════════════════════════════════════════════
        // 3. users  — depends on packages (migration creates base table)
        // ════════════════════════════════════════════════════════════

        // --- wallet columns ---
        const [userCols] = await db.query(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'"
        );
        let colNames = userCols.map(c => c.COLUMN_NAME.toLowerCase());

        if (!colNames.includes('balance')) {
            await db.query("ALTER TABLE users ADD COLUMN balance DECIMAL(15,2) DEFAULT 0.00");
            console.log('Added balance to users');
        }
        if (!colNames.includes('earnings')) {
            await db.query("ALTER TABLE users ADD COLUMN earnings DECIMAL(15,2) DEFAULT 0.00");
            console.log('Added earnings to users');
        }

        // --- membership columns ---
        const membershipCols = [
            { name: 'membership_package_id',  type: 'INT NULL' },
            { name: 'membership_started_at',   type: 'DATETIME NULL' },
            { name: 'membership_expires_at',   type: 'DATETIME NULL' },
        ];
        // refresh
        const [uc2] = await db.query(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'"
        );
        colNames = uc2.map(c => c.COLUMN_NAME.toLowerCase());
        for (const col of membershipCols) {
            if (!colNames.includes(col.name.toLowerCase())) {
                await db.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
                console.log(`Added ${col.name} to users`);
            }
        }

        // --- profile columns ---
        const profileCols = [
            { name: 'gender',            type: 'VARCHAR(50) NULL' },
            { name: 'date_of_birth',     type: 'DATE NULL' },
            { name: 'profession',        type: 'VARCHAR(100) NULL' },
            { name: 'education',         type: 'VARCHAR(150) NULL' },
            { name: 'location',          type: 'VARCHAR(150) NULL' },
            { name: 'bio',               type: 'TEXT NULL' },
            { name: 'interests',         type: 'TEXT NULL' },
            { name: 'relationship_goal', type: 'VARCHAR(100) NULL' },
            { name: 'marital_status',    type: 'VARCHAR(100) NULL' },
            { name: 'avatar_url',        type: 'TEXT NULL' },
        ];
        // refresh again
        const [uc3] = await db.query(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'"
        );
        colNames = uc3.map(c => c.COLUMN_NAME.toLowerCase());
        for (const col of profileCols) {
            if (!colNames.includes(col.name.toLowerCase())) {
                await db.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
                console.log(`Added ${col.name} to users`);
            }
        }

        // FK: users.membership_package_id -> packages.id
        await addFKIfNotExists('users', 'fk_users_pkg', 'membership_package_id', 'packages', 'id', 'SET NULL');
        console.log('users table verified');

        // ════════════════════════════════════════════════════════════
        // 4. posts  — depends on users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                user_id    INT          NOT NULL,
                content    TEXT         NOT NULL,
                image_url  VARCHAR(500),
                created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('posts', 'fk_posts_user', 'user_id', 'users', 'id', 'CASCADE');
        console.log('posts table verified');

        // ════════════════════════════════════════════════════════════
        // 5. events  — depends on users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS events (
                id                   INT AUTO_INCREMENT PRIMARY KEY,
                title                VARCHAR(255)  NOT NULL,
                description          TEXT,
                date_time            DATETIME      NOT NULL,
                location             VARCHAR(255)  NOT NULL,
                capacity             INT           NOT NULL DEFAULT 0,
                creator_id           INT           NOT NULL,
                status               VARCHAR(50)   DEFAULT 'active',
                created_at           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
                host_name            VARCHAR(150)  NULL,
                application_deadline DATETIME      NULL,
                entry_fee            DECIMAL(10,2) DEFAULT 0,
                CONSTRAINT fk_events_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // backward-compat column adds
        const [evCols] = await db.query(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events'"
        );
        const evColNames = evCols.map(c => c.COLUMN_NAME.toLowerCase());
        if (!evColNames.includes('host_name'))            await db.query("ALTER TABLE events ADD COLUMN host_name VARCHAR(150) NULL");
        if (!evColNames.includes('application_deadline')) await db.query("ALTER TABLE events ADD COLUMN application_deadline DATETIME NULL");
        if (!evColNames.includes('entry_fee'))            await db.query("ALTER TABLE events ADD COLUMN entry_fee DECIMAL(10,2) DEFAULT 0");

        await addFKIfNotExists('events', 'fk_events_creator', 'creator_id', 'users', 'id', 'CASCADE');
        console.log('events table verified');

        // ════════════════════════════════════════════════════════════
        // 6. transactions  — depends on users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                user_id     INT NOT NULL,
                type        ENUM('deposit','withdraw','earning','event_payment','event_income','membership_purchase') NOT NULL,
                amount      DECIMAL(15,2) NOT NULL,
                status      VARCHAR(20)   DEFAULT 'completed',
                description VARCHAR(255),
                created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_txn_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // ✅ Fix ENUM — always keep ALL values
        const [txCols] = await db.query("SHOW COLUMNS FROM transactions LIKE 'type'");
        if (txCols && txCols.length) {
            const enumStr = String(txCols[0].Type);
            if (!enumStr.includes('membership_purchase') || !enumStr.includes('event_payment')) {
                await db.query(
                    `ALTER TABLE transactions MODIFY COLUMN type
                     ENUM('deposit','withdraw','earning','event_payment','event_income','membership_purchase') NOT NULL`
                );
                console.log('Fixed transactions ENUM');
            }
        }
        await addFKIfNotExists('transactions', 'fk_txn_user', 'user_id', 'users', 'id', 'CASCADE');
        console.log('transactions table verified');

        // ════════════════════════════════════════════════════════════
        // 7. deposit_requests  — depends on users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS deposit_requests (
                id             INT AUTO_INCREMENT PRIMARY KEY,
                user_id        INT           NOT NULL,
                amount         DECIMAL(15,2) NOT NULL,
                method         VARCHAR(20)   NOT NULL,
                trx_id         VARCHAR(100)  NOT NULL UNIQUE,
                screenshot_url TEXT          NOT NULL,
                status         VARCHAR(20)   NOT NULL DEFAULT 'Pending',
                admin_note     TEXT,
                approved_by    INT           NULL,
                approved_at    TIMESTAMP     NULL,
                created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_dep_user     FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_dep_approved FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('deposit_requests', 'fk_dep_user',     'user_id',     'users', 'id', 'CASCADE');
        await addFKIfNotExists('deposit_requests', 'fk_dep_approved',  'approved_by', 'users', 'id', 'SET NULL');
        console.log('deposit_requests table verified');

        // ════════════════════════════════════════════════════════════
        // 8. withdraw_requests  — depends on users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS withdraw_requests (
                id             INT AUTO_INCREMENT PRIMARY KEY,
                user_id        INT           NOT NULL,
                amount         DECIMAL(15,2) NOT NULL,
                method         VARCHAR(20)   NOT NULL,
                account_number VARCHAR(100)  NOT NULL,
                status         VARCHAR(20)   NOT NULL DEFAULT 'Pending',
                admin_note     TEXT,
                approved_by    INT           NULL,
                approved_at    TIMESTAMP     NULL,
                created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_wdw_user     FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_wdw_approved FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('withdraw_requests', 'fk_wdw_user',     'user_id',     'users', 'id', 'CASCADE');
        await addFKIfNotExists('withdraw_requests', 'fk_wdw_approved',  'approved_by', 'users', 'id', 'SET NULL');
        console.log('withdraw_requests table verified');

        // ════════════════════════════════════════════════════════════
        // 9. match_requests  — depends on users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS match_requests (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                sender_id   INT NOT NULL,
                receiver_id INT NOT NULL,
                status      ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_mr_sender   (sender_id),
                INDEX idx_mr_receiver (receiver_id),
                INDEX idx_mr_status   (status),
                CONSTRAINT fk_mr_sender   FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_mr_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('match_requests', 'fk_mr_sender',   'sender_id',   'users', 'id', 'CASCADE');
        await addFKIfNotExists('match_requests', 'fk_mr_receiver', 'receiver_id', 'users', 'id', 'CASCADE');
        console.log('match_requests table verified');

        // ════════════════════════════════════════════════════════════
        // 10. event_participants  — depends on events + users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS event_participants (
                event_id  INT NOT NULL,
                user_id   INT NOT NULL,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (event_id, user_id),
                CONSTRAINT fk_ep_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                CONSTRAINT fk_ep_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('event_participants', 'fk_ep_event', 'event_id', 'events', 'id', 'CASCADE');
        await addFKIfNotExists('event_participants', 'fk_ep_user',  'user_id',  'users',  'id', 'CASCADE');
        console.log('event_participants table verified');

        // ════════════════════════════════════════════════════════════
        // 11. post_likes  — depends on posts + users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS post_likes (
                user_id    INT NOT NULL,
                post_id    INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, post_id),
                INDEX idx_pl_post (post_id),
                CONSTRAINT fk_pl_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                CONSTRAINT fk_pl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('post_likes', 'fk_pl_post', 'post_id', 'posts', 'id', 'CASCADE');
        await addFKIfNotExists('post_likes', 'fk_pl_user', 'user_id', 'users', 'id', 'CASCADE');

        // ════════════════════════════════════════════════════════════
        // 12. post_comments  — depends on posts + users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS post_comments (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                post_id    INT  NOT NULL,
                user_id    INT  NOT NULL,
                content    TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_pc_post (post_id),
                INDEX idx_pc_user (user_id),
                CONSTRAINT fk_pc_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                CONSTRAINT fk_pc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('post_comments', 'fk_pc_post', 'post_id', 'posts', 'id', 'CASCADE');
        await addFKIfNotExists('post_comments', 'fk_pc_user', 'user_id', 'users', 'id', 'CASCADE');

        // ════════════════════════════════════════════════════════════
        // 13. post_shares  — depends on posts + users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS post_shares (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                post_id    INT NOT NULL,
                user_id    INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_ps_post (post_id),
                CONSTRAINT fk_ps_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                CONSTRAINT fk_ps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('post_shares', 'fk_ps_post', 'post_id', 'posts', 'id', 'CASCADE');
        await addFKIfNotExists('post_shares', 'fk_ps_user', 'user_id', 'users', 'id', 'CASCADE');
        console.log('post interaction tables verified');

        // ════════════════════════════════════════════════════════════
        // 14. chat_messages  — depends on users
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                sender_id   INT  NOT NULL,
                receiver_id INT  NOT NULL,
                message     TEXT NOT NULL,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_chat_sender   FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_chat_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('chat_messages', 'fk_chat_sender',   'sender_id',   'users', 'id', 'CASCADE');
        await addFKIfNotExists('chat_messages', 'fk_chat_receiver', 'receiver_id', 'users', 'id', 'CASCADE');
        console.log('chat_messages table verified');

        // ════════════════════════════════════════════════════════════
        // 15. package_features  — depends on packages + features
        // ════════════════════════════════════════════════════════════
        await db.query(`
            CREATE TABLE IF NOT EXISTS package_features (
                package_tier_type VARCHAR(20)  NOT NULL,
                feature_key       VARCHAR(100) NOT NULL,
                PRIMARY KEY (package_tier_type, feature_key),
                CONSTRAINT fk_pf_feature FOREIGN KEY (feature_key) REFERENCES features(feature_key) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await addFKIfNotExists('package_features', 'fk_pf_feature', 'feature_key', 'features', 'feature_key', 'CASCADE');
        console.log('package_features table verified');

        console.log('\n🎉 DB initialized successfully — all tables & foreign keys are set up.\n');

    } catch (err) {
        console.error('DB init error:', {
            message:    err?.message,
            code:       err?.code,
            errno:      err?.errno,
            sql:        err?.sql,
            sqlState:   err?.sqlState,
            sqlMessage: err?.sqlMessage,
            stack:      err?.stack,
        });
    }
};
