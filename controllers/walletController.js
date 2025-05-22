const User = require("../models/User");
const Transaction = require("../models/Transaction");
const FraudLog = require("../models/FraudLog");
const sendMockEmail = require("../utils/mailer");

// Deposit
exports.deposit = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;

  if (amount <= 0) return res.status(400).json({ msg: "Invalid amount" });

  // Add inside withdraw controller, after updating balance:
  if (amount >= 10000) {
    await FraudLog.create({
      userId,
      type: "large-deposit",
      message: `Large Deposit of ₹${amount}`,
    });
  }
  // Send email notification (mocked)
  await sendMockEmail(
    req.user.email,
    "Deposit Notification",
    `You have successfully deposited ₹${amount}.`
  );

  const user = await User.findById(userId);
  user.balance += amount;
  await user.save();

  await Transaction.create({
    type: "deposit",
    amount,
    to: user._id,
  });

  res.status(200).json({ msg: "Deposit successful", balance: user.balance });
};

// Withdraw
exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;

  const user = await User.findById(userId);
  if (amount <= 0 || user.balance < amount)
    return res
      .status(400)
      .json({ msg: "Insufficient balance or invalid amount" });

  user.balance -= amount;
  await user.save();

  await Transaction.create({
    type: "withdraw",
    amount,
    from: user._id,
  });

  // Check for large withdrawals
  if (amount >= 10000) {
    await FraudLog.create({
      userId,
      type: "large-withdrawal",
      message: `Large withdrawal of ₹${amount}`,
    });
  }

  // Send email notification (mocked)
  await sendMockEmail(
    req.user.email,
    "Withdrawal Notification",
    `You have successfully withdrawn ₹${amount}.`
  );

  res.status(200).json({ msg: "Withdrawal successful", balance: user.balance });
};

// Transfer
exports.transfer = async (req, res) => {
  const { toUserId, amount } = req.body;
  const fromUserId = req.user.userId;

  if (amount <= 0 || fromUserId === toUserId)
    return res.status(400).json({ msg: "Invalid transfer" });

  const fromUser = await User.findById(fromUserId);
  const toUser = await User.findById(toUserId);

  if (!toUser) return res.status(404).json({ msg: "Recipient not found" });
  if (fromUser.balance < amount)
    return res.status(400).json({ msg: "Insufficient balance" });

  fromUser.balance -= amount;
  toUser.balance += amount;

  await fromUser.save();
  await toUser.save();

  await Transaction.create({
    type: "transfer",
    amount,
    from: fromUserId,
    to: toUserId,
  });

  // Check recent transfers in past 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recentTransfers = await Transaction.find({
    from: fromUserId,
    type: "transfer",
    createdAt: { $gte: fiveMinutesAgo },
  });

  if (recentTransfers.length >= 3) {
    await FraudLog.create({
      userId: fromUserId,
      type: "multiple-transfers",
      message: "More than 3 transfers in 5 minutes",
    });
  }

  // Send email notification (mocked)
  await sendMockEmail(
    fromUser.email,
    "Transfer Notification",
    `You have successfully transferred ₹${amount} to ${toUser.name}.`
  );

  res.status(200).json({ msg: "Transfer successful" });
};

// History
exports.history = async (req, res) => {
  const userId = req.user.userId;

  const transactions = await Transaction.find({
    $or: [{ from: userId }, { to: userId }],
  }).sort({ createdAt: -1 });

  res.status(200).json({ transactions });
};

// Greet User
exports.greet = (req, res) => {
  res.status(200).json({ msg: `Hello, user with ID: ${req.user.userId}` });
};
