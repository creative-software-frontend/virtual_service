const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const db = require("./config/db");

// ── Ensure presence columns exist ──────────────────────────────────────────
db.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP NULL AFTER updated_at,
    ADD COLUMN IF NOT EXISTS is_online TINYINT(1) NOT NULL DEFAULT 0 AFTER last_seen
`, (err) => {
    if (err) console.error("Failed to ensure users presence columns:", err.message);
});

// ── Ensure posts table exists ───────────────────────────────────────────────
db.query(`
    CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(500) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) console.error("Failed to ensure posts table:", err.message);
});

// ── Ensure chat_messages table exists ──────────────────────────────────────
db.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) console.error("Failed to ensure chat_messages table:", err.message);
});

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    credentials: true
}));
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Backend is running");
});


const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const testRoutes = require("./routes/testRoutes");

app.use("/api/test", testRoutes);

const userRoutes = require("./routes/userRoutes");

app.use("/api/user", userRoutes);

const providerRoutes = require("./routes/providerRoutes");

app.use("/api/provider", providerRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});