const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const membershipController = require("../controllers/membershipController");

router.get("/current", authMiddleware, membershipController.getCurrentMembership);
router.get("/status", authMiddleware, membershipController.getMembershipStatus);
router.post("/buy", authMiddleware, membershipController.buyMembership);
router.post("/cancel", authMiddleware, membershipController.cancelMembership);

// Dedicated package catalogs (role isolation)
router.get("/user-packages", authMiddleware, membershipController.getUserPackages);
router.get("/provider-packages", authMiddleware, membershipController.getProviderPackages);

module.exports = router;


