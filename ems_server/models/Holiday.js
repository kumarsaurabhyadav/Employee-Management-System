import mongoose from "mongoose";
import { DEPARTMENTS } from "../constants/departments.js";

const holidaySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["HOLIDAY", "OPTIONAL"],
      default: "HOLIDAY",
    },
    appliesToDepartments: {
      type: [String],
      enum: DEPARTMENTS,
      default: [],
    },
  },
  { timestamps: true },
);

const Holiday = mongoose.models.Holiday || mongoose.model("Holiday", holidaySchema);

export default Holiday;

