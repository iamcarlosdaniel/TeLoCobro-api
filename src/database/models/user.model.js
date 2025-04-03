import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verifyOtp: {
      type: String,
    },
    verifyOtpExpireAt: {
      type: Number,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
    },
    resetOtpExpireAt: {
      type: Number,
    },
    //*Campos de verificación de teléfono
    //?La api sigue activa?
    phoneVerifyOtp: {
      type: String,
    },
    phoneVerifyOtpExpireAt: {
      type: Number,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
