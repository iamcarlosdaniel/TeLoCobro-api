import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    postal_code: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    _id: false,
  }
);

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
    date_of_birth: {
      type: Date,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["hombre", "mujer", "prefiero no decir", "otro"],
      required: true,
    },
    profile_picture: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 280,
    },
    location: locationSchema,
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

    //!Revisar si es necesario
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
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
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
