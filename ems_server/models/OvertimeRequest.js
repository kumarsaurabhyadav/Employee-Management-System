import mongoose from "mongoose";

const overtimeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    hours: { type: Number, required: true },
    rateMultiplier: { type: Number, default: 1.5 },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    reviewedByUserId: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

overtimeSchema.index({ employeeId: 1, date: 1 }, { unique: false });

const OvertimeRequest =
  mongoose.models.OvertimeRequest || mongoose.model("OvertimeRequest", overtimeSchema);

export default OvertimeRequest;

