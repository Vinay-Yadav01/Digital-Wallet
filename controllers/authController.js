const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30min",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).json({ msg: "User not found" });
    const user = await User.findById(userId);
    user.isDeleted = true;
    await user.save();
    res.status(200).json({ msg: "Account soft-deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error deleting account", err });
  }
};
