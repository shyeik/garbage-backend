import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import scheduleRoutes from "./routes/schedule.js";
import announcementRoutes from "./routes/announcement.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/api/ping", (req, res) => {
  res.json({ message: "Server running!" });
});

//routes
app.use("/api/auth", authRoutes); // Your route will be at /api/auth/register
app.use("/api/schedule", scheduleRoutes); // For admin/user schedules
app.use("/api/announcements", announcementRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
