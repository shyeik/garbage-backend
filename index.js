import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import scheduleRoutes from "./routes/schedule.js";
import announcementRoutes from "./routes/announcement.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // Adjust as needed
    credentials: true, // Allow credentials if needed
  })
);
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

app.get("/", (req, res) => {
  res.json("Hello world!");
});

app.listen(port, () => {
  console.log(`Server app is listening at http://localhost:${port}`);
});
