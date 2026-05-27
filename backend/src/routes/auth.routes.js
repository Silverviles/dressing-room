const express = require("express");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken } = require("../utils/token");
const authenticate = require("../middleware/auth");

const router = express.Router();

const formatUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
  role: user.role,
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      username: normalizedUsername,
      passwordHash,
      role: "user",
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return res.status(201).json({
      token,
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return res.json({
      token,
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
});

router.get("/me", authenticate, (req, res) => {
  return res.json({ user: formatUser(req.user) });
});

module.exports = router;
