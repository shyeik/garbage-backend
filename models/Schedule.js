import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  barangay: { type: String, required: true },
  street: { type: String, required: true },
  day: { type: String, required: true }, // e.g., "Tuesday"
  type: { type: String, required: true }, // "Biodegradable", "Non-biodegradable", etc.
  time: { type: String, required: true }, // "6:00 AM"
  status: { type: String, default: "upcoming" }, // optional
  createdAt: { type: Date, default: Date.now, expires: "1d" },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
