const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  deposit,
  withdraw,
  transfer,
  history,
  greet
} = require("../controllers/walletController");

router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);
router.post("/transfer", authMiddleware, transfer);
router.get("/history", authMiddleware, history);

router.get('/protected-test', authMiddleware, greet);


module.exports = router;
