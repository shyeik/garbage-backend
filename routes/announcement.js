import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  try {
    const newPost = new Announcement(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create announcement." });
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
