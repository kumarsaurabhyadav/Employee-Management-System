import Employee from "../models/Employee.js";
import LeaveBalance from "../models/LeaveBalance.js";

const ensureBalance = async (employeeId) => {
  const existing = await LeaveBalance.findOne({ employeeId }).lean();
  if (existing) return existing;
  const created = await LeaveBalance.create({ employeeId });
  return created.toObject();
};

// GET /api/leave/balance
export const getMyLeaveBalance = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId }).lean();
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    const balance = await ensureBalance(employee._id);
    return res.json({ data: balance });
  } catch {
    return res.status(500).json({ error: "Failed to fetch leave balance" });
  }
};

// GET /api/leave/balances?employeeId=...
export const getLeaveBalanceByEmployee = async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) return res.status(400).json({ error: "employeeId is required" });
    const balance = await ensureBalance(employeeId);
    return res.json({ data: balance });
  } catch {
    return res.status(500).json({ error: "Failed to fetch leave balance" });
  }
};

// PATCH /api/leave/balances/:employeeId
export const updateLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { annual, casual, sick, unpaidAllowed } = req.body;

    const update = {};
    if (annual != null) update.annual = Number(annual);
    if (casual != null) update.casual = Number(casual);
    if (sick != null) update.sick = Number(sick);
    if (unpaidAllowed != null) update.unpaidAllowed = Boolean(unpaidAllowed);

    const doc = await LeaveBalance.findOneAndUpdate(
      { employeeId },
      { $set: update, $setOnInsert: { employeeId } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return res.json({ success: true, data: doc });
  } catch {
    return res.status(500).json({ error: "Failed to update leave balance" });
  }
};

