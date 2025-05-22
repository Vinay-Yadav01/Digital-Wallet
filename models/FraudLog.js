const mongoose = require("mongoose");

const fraudLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String }, // e.g., 'multiple-transfers', 'large-withdrawal'
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FraudLog", fraudLogSchema);
