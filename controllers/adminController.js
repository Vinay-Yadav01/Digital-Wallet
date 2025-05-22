const User = require("../models/User");
const Transaction = require("../models/Transaction");
const FraudLog = require("../models/FraudLog");

exports.getFlaggedTransactions = async (req, res) => {
  try {
    const logs = await FraudLog.find()
      .sort({ timestamp: -1 })
      .populate("userId", "name email");

    res.status(200).json({ frauds: logs });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching fraud logs", err });
  }
};

exports.getTotalUserBalance = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, totalBalance: { $sum: "$balance" } } },
    ]);
    res.status(200).json({ totalBalance: result[0]?.totalBalance || 0 });
  } catch (err) {
    res.status(500).json({ msg: "Error calculating total balance", err });
  }
};

exports.getTopUsers = async (req, res) => {
  try {
    const topUsers = await User.find({ isDeleted: false })
      .sort({ balance: -1 })
      .limit(5)
      .select("name email balance");

    res.status(200).json({ topUsers });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching top users", err });
  }
};
