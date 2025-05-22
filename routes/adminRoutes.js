const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getFlaggedTransactions,
  getTotalUserBalance,
  getTopUsers
} = require('../controllers/adminController');

router.get('/flags', auth, getFlaggedTransactions);
router.get('/total-balances', auth, getTotalUserBalance);
router.get('/top-users', auth, getTopUsers);

module.exports = router;
