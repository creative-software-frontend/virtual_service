const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const db = require("./config/db");

app.use(cors());
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});