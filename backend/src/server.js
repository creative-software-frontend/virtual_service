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