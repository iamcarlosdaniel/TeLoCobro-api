import mongoose from "mongoose";

const devSchema = new mongoose.Schema({
  mail_service: {
    type: String,
    enum: ["gmail"],
    required: true,
  },
  mail_service_user: {
    type: String,
    required: true,
  },
  mail_service_password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Dev", devSchema);
