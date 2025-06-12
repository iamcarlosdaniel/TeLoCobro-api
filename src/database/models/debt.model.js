import mongoose from "mongoose";

const debtSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  erp_debt_id: {
    type: String,
    unique: true,
    required: true,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  issue_date: {
    type: Date,
    required: true,
  },
  invoice_number: {
    type: String,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  currency: {
    type: String,
    enum: ["USD", "BS"],
    required: true,
  },
  outstanding: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "overdue"],
    required: true,
    default: "pending",
  },
  paid_at: {
    type: Date,
    trim: true,
  },
});

export default mongoose.model("Debt", debtSchema);
