const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const walletController = require("../controllers/walletController");

router.get("/wallet", authMiddleware, walletController.getWallet);
router.post("/deposit-request", authMiddleware, walletController.createDepositRequest);
router.get("/deposit-history", authMiddleware, walletController.getDepositHistory);
router.post("/withdraw-request", authMiddleware, walletController.createWithdrawRequest);
router.get("/withdraw-history", authMiddleware, walletController.getWithdrawHistory);

module.exports = router;
