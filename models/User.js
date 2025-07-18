import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  barangay: { type: String, required: true },
  street: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  subscribed: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);

export default User;
