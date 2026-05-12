import ShiftPolicy from "../models/ShiftPolicy.js";
import { DEPARTMENTS } from "../constants/departments.js";

// GET /api/shifts
export const listShiftPolicies = async (_req, res) => {
  try {
    const policies = await ShiftPolicy.find().sort({ department: 1 }).lean();
    return res.json({
      data: policies,
      departments: DEPARTMENTS,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch shift policies" });
  }
};

// PUT /api/shifts/:department
export const upsertShiftPolicy = async (req, res) => {
  try {
    const { department } = req.params;
    const { timezone, shiftStartMinutes, shiftEndMinutes, lateGraceMinutes } = req.body;

    if (!DEPARTMENTS.includes(department)) {
      return res.status(400).json({ error: "Invalid department" });
    }

    const start = Number(shiftStartMinutes);
    const end = Number(shiftEndMinutes);
    const grace = Number(lateGraceMinutes);

    if (![start, end, grace].every((n) => Number.isFinite(n))) {
      return res.status(400).json({ error: "Invalid numeric values" });
    }
    if (start < 0 || start >= 24 * 60 || end < 0 || end >= 24 * 60) {
      return res.status(400).json({ error: "Shift minutes must be within 0-1439" });
    }
    if (grace < 0 || grace > 180) {
      return res.status(400).json({ error: "Grace minutes must be within 0-180" });
    }

    const doc = await ShiftPolicy.findOneAndUpdate(
      { department },
      {
        department,
        timezone: timezone || "Asia/Kolkata",
        shiftStartMinutes: start,
        shiftEndMinutes: end,
        lateGraceMinutes: grace,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update shift policy" });
  }
};

