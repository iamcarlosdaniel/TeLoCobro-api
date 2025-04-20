import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    iso_code: {
      type: String,
      required: true,
      unique: true,
    },
    phone_code: {
      type: String,
      required: true,
    },
    is_allowed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Country", countrySchema);
