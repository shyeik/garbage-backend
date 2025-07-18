import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["Announcement", "Notice", "Reminder", "Urgent"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: "1d" }, // 🔥 auto-delete after 1 day
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;
