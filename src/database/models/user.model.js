/**
 * Author: Carlos Daniel Menchaca Arauz
 * License: Apache License 2.0
 * Description: Este archivo define los esquemas de verificación de cuenta, teléfono y restablecimiento de contraseña para usuarios.
 * Creation Date: April 23, 2025
 *
 * Copyright (c) 2025 Carlos Daniel Menchaca Arauz
 *
 * Repository on GitHub: https://github.com/iamcarlosdaniel/auth-module-mern-stack-api
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import mongoose from "mongoose";

const accountVerificationSchema = new mongoose.Schema(
  {
    verify_otp: {
      type: String,
      trim: true,
    },
    verify_otp_expire_at: {
      type: Date,
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
      type: Date,
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
      type: Date,
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
