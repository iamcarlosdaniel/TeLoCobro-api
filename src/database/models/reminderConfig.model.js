import mongoose from "mongoose";

const reminderConfigSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      unique: true,
    },
    days_before_due: {
      type: Number,
      default: 3,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["enabled", "disabled"],
      default: "disabled",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ReminderConfig", reminderConfigSchema);
