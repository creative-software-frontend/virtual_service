const db = require("../config/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { generateReferralLink } = require("../utils/referralLink");

exports.register = async (req, res) => {
    const { name, email, phone, password, role, privacyAccepted } = req.body || {};

    // ✅ Task 3: Check Privacy Policy acceptance
    if (!privacyAccepted) {
        return res.status(400).json({ 
            message: "You must accept the Privacy Policy to continue" 
        });
    }

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const allowedRoles = ["user", "provider"];
    const assignedRole = allowedRoles.includes(role) ? role : "user";

    db.query("SELECT email FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (name, email, phone, password, role, privacy_accepted, privacy_accepted_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
            [name, email, phone, hashedPassword, assignedRole, 1],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Database error" });

                const userId = result.insertId;
                
                // ✅ Task 2: Generate referral link based on role
                const referral = generateReferralLink(userId, assignedRole);
                const token = generateToken(userId, assignedRole);

                res.status(201).json({
                    id: userId,
                    name,
                    email,
                    phone,
                    role: assignedRole,
                    referralLink: referral.url,
                    referralCode: referral.code,
                    token
                });
            }
        );
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Task 2: Generate referral link on login too
        const referral = generateReferralLink(user.id, user.role);
        const token = generateToken(user.id, user.role);

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            referralLink: referral.url,
            referralCode: referral.code,
            token
        });
    });
};