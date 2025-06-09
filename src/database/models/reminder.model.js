import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    sent_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    sent_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    channel: {
      type: String,
      enum: ["email", "sms", "push"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reminder", reminderSchema);
