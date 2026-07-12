const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const membershipController = require("../controllers/membershipController");

router.get("/current", authMiddleware, membershipController.getCurrentMembership);
router.get("/status", authMiddleware, membershipController.getMembershipStatus);
router.post("/buy", authMiddleware, membershipController.buyMembership);


module.exports = router;

