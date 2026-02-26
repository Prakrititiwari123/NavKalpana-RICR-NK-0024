// models/Contact.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String},
    email: { type: String },
    subject: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);