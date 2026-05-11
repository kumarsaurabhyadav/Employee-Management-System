import mongoose from "mongoose";
import { DEPARTMENTS } from "../constants/departments.js";

const shiftPolicySchema = new mongoose.Schema(
  {
    department: { type: String, enum: DEPARTMENTS, required: true, unique: true },
    timezone: { type: String, default: "Asia/Kolkata" },
    shiftStartMinutes: { type: Number, default: 9 * 60 }, // 09:00
    shiftEndMinutes: { type: Number, default: 18 * 60 }, // 18:00
    lateGraceMinutes: { type: Number, default: 15 },
  },
  { timestamps: true },
);

const ShiftPolicy =
  mongoose.models.ShiftPolicy || mongoose.model("ShiftPolicy", shiftPolicySchema);

export default ShiftPolicy;

