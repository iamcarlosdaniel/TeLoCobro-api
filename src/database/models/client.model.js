import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nit: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    //** Acceso a la app movil**//
    app_verify_otp: {
      type: String,
      required: true,
    },
    app_verify_otp_expired_at: {
      type: Date,
      required: true,
    },
    app_access_enable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Client", clientSchema);
