import mongoose from "mongoose";

const attendanceCorrectionSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    requestedCheckIn: { type: Date, default: null },
    requestedCheckOut: { type: Date, default: null },
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

attendanceCorrectionSchema.index({ employeeId: 1, date: 1 }, { unique: false });

const AttendanceCorrectionRequest =
  mongoose.models.AttendanceCorrectionRequest ||
  mongoose.model("AttendanceCorrectionRequest", attendanceCorrectionSchema);

export default AttendanceCorrectionRequest;

