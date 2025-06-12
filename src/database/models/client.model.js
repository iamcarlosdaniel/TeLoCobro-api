import mongoose from "mongoose";
import { type } from "os";

const clientSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    erp_client_id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nit: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    //**Datos de sus deudas **/
    total_debt_bs: {
      type: Number,
      default: 0,
    },
    total_pending_debt_bs: {
      type: Number,
      default: 0,
    },
    average_payment_time: {
      type: Number,
      default: 0,
    },
    payment_delay_rate: {
      type: Number,
      default: 0,
    },
    debt_count: {
      type: Number,
      default: 0,
    },
    //**Informacion sobre la morrosidad del cliente **/
    morosity: {
      prediction: {
        type: Number,
        default: 0,
      },
      probability: {
        type: Number,
        default: 0,
      },
      threshold: {
        type: Number,
        default: 0,
      },
    },
    //** Acceso a la app movil**//
    app_verify_otp: {
      type: String,
    },
    app_verify_otp_expired_at: {
      type: Date,
    },
    app_access: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Client", clientSchema);
