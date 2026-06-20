const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(
            "Missing JWT_SECRET in environment. Create backend/.env with JWT_SECRET=<your_secret>."
        );
    }

    return jwt.sign({ id, role }, secret, { expiresIn: "7d" });
};

module.exports = generateToken;

