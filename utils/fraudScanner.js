const Transaction = require('../models/Transaction');
const FraudLog = require('../models/FraudLog');
const User = require('../models/User');

const scanFrauds = async () => {
  console.log('⏰ Running daily fraud scan...');

  const users = await User.find({ isDeleted: false });

  for (const user of users) {
    const userId = user._id;

    // Find transfers in past 5 mins (mocked for demo — in real use, scan past day)
    const recentTransfers = await Transaction.find({
      from: userId,
      type: 'transfer',
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // mock time window
    });

    if (recentTransfers.length >= 3) {
      await FraudLog.create({
        userId,
        type: 'multiple-transfers',
        message: '3+ transfers in short span (cron)'
      });
    }

    const largeWithdrawals = await Transaction.find({
      from: userId,
      type: 'withdraw',
      amount: { $gte: 10000 },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    for (const tx of largeWithdrawals) {
      await FraudLog.create({
        userId,
        type: 'large-withdrawal',
        message: `Large withdrawal of ₹${tx.amount} (cron)`
      });
    }
  }

  console.log('✅ Daily fraud scan complete.');
};

module.exports = scanFrauds;
