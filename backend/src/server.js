const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const db = require("./config/db");

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

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/provider", require("./routes/providerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// 404
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // optional: safe startup init
    await require("./startup/initTables")(db);
});