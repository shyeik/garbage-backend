import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Create announcement
router.post("/", async (req, res) => {
  try {
    const newPost = new Announcement(req.body);
    await newPost.save();
    console.log("✅ Announcement created:", newPost);
    res.status(201).json(newPost); // return the created document
  } catch (err) {
    console.error("❌ Error creating announcement:", err);
    res.status(500).end(); // internal server error
  }
});

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const all = await Announcement.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.error("❌ Error fetching announcements:", err);
    res.status(500).end();
  }
});

export default router;
