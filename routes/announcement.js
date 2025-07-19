// routes/announcementRoutes.js
import express from "express";
import Announcement from "../models/Announcement.js";
import User from "../models/User.js"; // to get emails
import transporter from "../utils/mailer.js";

const router = express.Router();

// POST announcement and notify all users
router.post("/", async (req, res) => {
  try {
    const newPost = new Announcement(req.body);
    await newPost.save();

    // ✅ Find all users to notify
    const users = await User.find();

    // ✅ Send email to each
    users.forEach((user) => {
      transporter.sendMail({
        from: '"Garbage Notifier" <garbagenotifier@gmail.com>',
        to: user.email,
        subject: `${newPost.type} from Garbage Notifier`,
        text: newPost.message,
      });
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error sending announcement:", err);
    res.status(500).json({ error: "Failed to create and send announcement." });
  }
});

// Get all
router.get("/", async (req, res) => {
  try {
    const all = await Announcement.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch announcements." });
  }
});

export default router;
