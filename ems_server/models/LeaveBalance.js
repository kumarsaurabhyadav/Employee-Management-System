import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    annual: { type: Number, default: 0 },
    casual: { type: Number, default: 0 },
    sick: { type: Number, default: 0 },
    unpaidAllowed: { type: Boolean, default: true },
    accrualMonthly: {
      annual: { type: Number, default: 1 },
      casual: { type: Number, default: 1 },
      sick: { type: Number, default: 1 },
    },
    carryForwardCap: {
      annual: { type: Number, default: 30 },
      casual: { type: Number, default: 12 },
      sick: { type: Number, default: 12 },
    },
  },
  { timestamps: true },
);

const LeaveBalance =
  mongoose.models.LeaveBalance || mongoose.model("LeaveBalance", leaveBalanceSchema);

export default LeaveBalance;

