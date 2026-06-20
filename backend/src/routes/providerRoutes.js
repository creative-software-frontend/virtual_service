const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// BEFORE (NOT GOOD)
// router.get("/provider-dashboard", ...)

// NOW (CLEAN STRUCTURE)
router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware(["provider"]),
    (req, res) => {
        res.json({ message: "Welcome provider" });
    }
);

router.get(
    "/common",
    authMiddleware,
    roleMiddleware(["user", "provider"]),
    (req, res) => {
        res.json({ message: "Common access" });
    }
);

module.exports = router;