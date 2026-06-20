/**
 * seed-admin.js
 * Run once: node seed-admin.js
 * Creates the admin user in the database (admin@bluedise.com / admin123)
 */
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function seed() {
    const email = 'admin@bluedise.com';
    const plainPassword = 'admin123';
    const name = 'Admin';
    const role = 'admin';

    const hash = await bcrypt.hash(plainPassword, 10);

    db.connect((err) => {
        if (err) {
            console.error('❌ DB connection failed:', err.message);
            process.exit(1);
        }

        // Check if admin already exists
        db.query('SELECT id FROM users WHERE email = ?', [email], (err, result) => {
            if (err) {
                console.error('❌ Query error:', err.message);
                db.end();
                return;
            }

            if (result.length > 0) {
                console.log('ℹ️  Admin user already exists — skipping.');
                db.end();
                return;
            }

            db.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hash, role],
                (err) => {
                    if (err) {
                        console.error('❌ Insert failed:', err.message);
                    } else {
                        console.log('✅ Admin user created: admin@bluedise.com / admin123');
                    }
                    db.end();
                }
            );
        });
    });
}

seed();
