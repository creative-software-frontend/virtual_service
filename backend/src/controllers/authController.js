const db = require("../config/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    const { name, email, password } = req.body || {};


    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    db.query("SELECT email FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (name,email,password) VALUES (?,?,?)",
            [name, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json(err);

                res.status(201).json({
                    id: result.insertId,
                    name,
                    email,
                    token: generateToken(result.insertId)
                });
            }
        );
    });
};
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        });
    });
};