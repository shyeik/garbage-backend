import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { email, name, password, street, barangay } = req.body;

  // Check for existing email
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already used" });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = new User({
    email,
    name,
    password: hashedPassword,
    barangay,
    street,
    subscribed: true,
  });

  await user.save();
  res.status(201).json({ message: "User registered" });
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt:", email); // log login attempt

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ User not found");
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("❌ Password mismatch");
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const responseUser = {
    email: user.email,
    name: user.name,
    street: user.street,
    barangay: user.barangay,
    subscribed: user.subscribed,
    role: user.role,
  };

  console.log("✅ Login success:", responseUser); // see response being sent

  res.status(200).json({
    message: "Login successful",
    user: responseUser,
  });
});

// Get All Users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}); // exclude password field
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
