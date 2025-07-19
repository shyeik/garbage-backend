import express from "express";
import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import transporter from "../utils/mailer.js";

const router = express.Router();

// GET all schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find().sort("day");
    res.json(schedules);
  } catch (err) {
    console.error("❌ Error fetching all schedules:", err);
    res.status(500).end(); // just send error code
  }
});

// POST: Add new schedule and notify users
router.post("/", async (req, res) => {
  try {
    const { barangay, street, day, type, time } = req.body;

    // 1. Save schedule to DB
    const newSchedule = new Schedule({ barangay, street, day, type, time });
    await newSchedule.save();
    console.log("✅ Schedule saved:", newSchedule);

    // 2. Find users matching barangay + street
    const users = await User.find({ barangay, street });
    console.log(`📧 Sending emails to ${users.length} users`);

    // 3. Send notification email to each
    users.forEach((user) => {
      transporter.sendMail({
        from: '"Garbage Notifier" <yourgmail@gmail.com>',
        to: user.email,
        subject: `🗑️ New Garbage Collection for ${street}`,
        text: `Hi! There's a new garbage collection in your street:\n📍 ${street}\n📅 Day: ${day}\n🗂️ Type: ${type}\n⏰ Time: ${time}`,
      });
    });

    res.status(201).end(); // created successfully
  } catch (err) {
    console.error("❌ Error in POST /schedule:", err);
    res.status(400).end(); // bad request
  }
});

// DELETE schedule
router.delete("/:id", async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Deleted schedule ID: ${req.params.id}`);
    res.status(204).end(); // no content
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).end();
  }
});

// Get schedules by barangay and optional street
router.get("/user/:barangay", async (req, res) => {
  const { barangay } = req.params;
  const { street } = req.query;

  const filter = { barangay };
  if (street) filter.street = street;

  try {
    const schedules = await Schedule.find(filter).sort("day");
    res.json(schedules);
  } catch (error) {
    console.error("❌ Error fetching schedules by location:", error);
    res.status(500).end();
  }
});

// Update schedule
router.put("/:id", async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSchedule) {
      console.warn("⚠️ Schedule not found for update:", req.params.id);
      return res.status(404).end();
    }

    console.log("✅ Schedule updated:", updatedSchedule);
    res.json(updatedSchedule);
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).end();
  }
});

export default router;
