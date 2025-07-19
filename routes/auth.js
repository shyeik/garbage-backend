import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { email, name, password, street, barangay } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ Registration failed: Email already used");
      return res.status(400).end();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      password: hashedPassword,
      barangay,
      street,
      subscribed: true,
    });

    await user.save();
    console.log("✅ User registered:", email);
    res.status(201).end();
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).end();
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Login failed: User not found");
      return res.status(400).end();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Login failed: Password mismatch");
      return res.status(400).end();
    }

    const responseUser = {
      email: user.email,
      name: user.name,
      street: user.street,
      barangay: user.barangay,
      subscribed: user.subscribed,
      role: user.role,
    };

    console.log("✅ Login success:", responseUser);
    res.status(200).json({ user: responseUser });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).end();
  }
});

// Get All Users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    console.log("📦 All users fetched");
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).end();
  }
});

export default router;
