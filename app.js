const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Digital Wallet API");
});

const walletRoutes = require("./routes/walletRoutes");
app.use("/api/wallet", walletRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

module.exports = app;
