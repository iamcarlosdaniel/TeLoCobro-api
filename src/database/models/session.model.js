import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      enum: ["user", "client"],
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    device_type: {
      type: String,
      enum: ["web", "mobile"],
      required: true,
    },
    auth_token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("session", sessionSchema);
