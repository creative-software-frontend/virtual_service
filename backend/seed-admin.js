/**
 * seed-admin.js
 * Run once: node seed-admin.js
 * Creates admin user safely using environment variables
 */

const bcrypt = require("bcrypt");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// ❌ STRICT CHECK (no silent defaults)
if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
    console.error("❌ Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD in .env");
    process.exit(1);
}

async function seed() {
    const email = process.env.SEED_ADMIN_EMAIL;
    const plainPassword = process.env.SEED_ADMIN_PASSWORD;
    const name = process.env.SEED_ADMIN_NAME || "Admin";
    const role = process.env.SEED_ADMIN_ROLE || "admin";
    const phone = process.env.SEED_ADMIN_PHONE;

    const hash = await bcrypt.hash(plainPassword, 8); // faster for seeder

    db.connect((err) => {
        if (err) {
            console.error("❌ DB connection failed:", err.message);
            process.exit(1);
        }

        // check existing admin
        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email],
            (err, result) => {
                if (err) {
                    console.error("❌ Query error:", err.message);
                    db.end();
                    return;
                }

                if (result.length > 0) {
                    console.log("ℹ️ Admin already exists — skipping.");
                    db.end();
                    return;
                }

                db.query(
                    "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
                    [name, email, phone, hash, role],

                    (err) => {
                        if (err) {
                            console.error("❌ Insert failed:", err.message);
                        } else {
                            console.log("✅ Admin user created successfully");
                        }
                        db.end();
                    }
                );
            }
        );
    });
}

seed();