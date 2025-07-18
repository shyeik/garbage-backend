import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "garbagenotifier@gmail.com",
    pass: "aqbirvquijmxfmws", // ⚠️ Use App Password, not your real Gmail password
  },
});

export default transporter;
