import mongoose from "mongoose";

const accountVerificationSchema = new mongoose.Schema(
  {
    verify_otp: {
      type: String,
      trim: true,
    },
    verify_otp_expire_at: {
      type: Number,
      trim: true,
    },
    is_account_verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const phoneVerificationSchema = new mongoose.Schema(
  {
    phone_verify_otp: {
      type: String,
      trim: true,
    },
    phone_verify_otp_expire_at: {
      type: Number,
      trim: true,
    },
    is_phone_verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const passwordResetSchema = new mongoose.Schema(
  {
    reset_otp: {
      type: String,
      trim: true,
    },
    reset_otp_expired_at: {
      type: Number,
      trim: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
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
    date_of_birth: {
      type: Date,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 280,
    },
    location: {
      city_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true,
      },
    },
    phone_number: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    account_verification: accountVerificationSchema,
    phone_verification: phoneVerificationSchema,
    password_reset: passwordResetSchema,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
