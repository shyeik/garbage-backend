import express from "express";
import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import transporter from "../utils/mailer.js";
const router = express.Router();

// GET all schedules
router.get("/", async (req, res) => {
  const schedules = await Schedule.find().sort("day");
  res.json(schedules);
});

// POST: Add new schedule and notify users
router.post("/", async (req, res) => {
  try {
    const { barangay, street, day, type, time } = req.body;

    // 1. Save schedule to DB
    const newSchedule = new Schedule({ barangay, street, day, type, time });
    await newSchedule.save();

    // 2. Find users matching barangay + street
    const users = await User.find({ barangay, street });

    // 3. Send notification email to each
    users.forEach((user) => {
      transporter.sendMail({
        from: '"Garbage Notifier" <yourgmail@gmail.com>',
        to: user.email,
        subject: `🗑️ New Garbage Collection for ${street}`,
        text: `Hi! There's a new garbage collection in your street:\n📍 ${street}\n📅 Day: ${day}\n🗂️ Type: ${type}\n⏰ Time: ${time}`,
      });
    });

    res.status(201).json({ message: "Schedule added and notifications sent" });
  } catch (err) {
    console.error("Error in schedule POST:", err);
    res.status(400).json({ error: "Failed to add schedule or send email" });
  }
});

//psgc.cloud/api/cities/1381300000/1381300022
// DELETE schedule
router.delete("/:id", async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// Get schedules by barangay and optional street
router.get("/user/:barangay", async (req, res) => {
  const { barangay } = req.params;
  const { street } = req.query;

  const filter = { barangay };
  if (street) {
    filter.street = street;
  }

  try {
    const schedules = await Schedule.find(filter).sort("day");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

export default router;
