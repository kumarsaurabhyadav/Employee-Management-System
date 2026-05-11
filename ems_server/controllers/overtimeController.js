import OvertimeRequest from "../models/OvertimeRequest.js";
import Employee from "../models/Employee.js";
import AuditLog from "../models/AuditLog.js";
import Notification from "../models/Notification.js";

const toDay = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  dt.setHours(0, 0, 0, 0);
  return dt;
};

const logAudit = async ({ req, action, entityType, entityId, details }) => {
  const session = req.session || {};
  await AuditLog.create({
    actorUserId: session.userId,
    actorRole: session.role,
    action,
    entityType,
    entityId,
    details: details || {},
  });
};

// POST /api/overtime
export const createOvertimeRequest = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId }).lean();
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    if (employee.isDeleted) return res.status(403).json({ error: "Account deactivated" });

    const { date, hours, rateMultiplier, reason } = req.body;
    const day = toDay(date);
    const hrs = Number(hours);
    const mult = rateMultiplier == null ? 1.5 : Number(rateMultiplier);
    if (!day) return res.status(400).json({ error: "Invalid date" });
    if (!Number.isFinite(hrs) || hrs <= 0 || hrs > 12) {
      return res.status(400).json({ error: "Hours must be between 0 and 12" });
    }
    if (!Number.isFinite(mult) || mult < 1 || mult > 3) {
      return res.status(400).json({ error: "Invalid multiplier" });
    }
    if (!reason) return res.status(400).json({ error: "Reason is required" });

    const doc = await OvertimeRequest.create({
      employeeId: employee._id,
      date: day,
      hours: hrs,
      rateMultiplier: mult,
      reason,
    });

    await logAudit({
      req,
      action: "OVERTIME_REQUEST_CREATE",
      entityType: "OvertimeRequest",
      entityId: doc._id.toString(),
      details: { date: day.toISOString(), hours: hrs },
    });

    return res.json({ success: true, data: doc });
  } catch {
    return res.status(500).json({ error: "Failed to create overtime request" });
  }
};

// GET /api/overtime
export const listOvertimeRequests = async (req, res) => {
  try {
    const session = req.session;
    const status = req.query.status;

    if (["ADMIN", "MANAGER"].includes(session.role)) {
      const where = status ? { status } : {};
      const rows = await OvertimeRequest.find(where)
        .populate("employeeId")
        .sort({ createdAt: -1 });

      const filtered =
        session.role === "MANAGER" && session.department
          ? rows.filter((r) => r.employeeId?.department === session.department)
          : rows;

      const data = filtered.map((r) => {
        const obj = r.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id?.toString(),
        };
      });
      return res.json({ data });
    }

    const employee = await Employee.findOne({ userId: session.userId }).lean();
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    const where = { employeeId: employee._id };
    if (status) where.status = status;
    const data = await OvertimeRequest.find(where).sort({ createdAt: -1 }).lean();
    return res.json({ data });
  } catch {
    return res.status(500).json({ error: "Failed to fetch overtime requests" });
  }
};

// PATCH /api/overtime/:id
export const reviewOvertimeRequest = async (req, res) => {
  try {
    const session = req.session;
    if (!["ADMIN", "MANAGER"].includes(session.role)) {
      return res.status(403).json({ error: "Admin/Manager access required" });
    }
    const { status } = req.body;
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const doc = await OvertimeRequest.findById(req.params.id).populate("employeeId");
    if (!doc) return res.status(404).json({ error: "Not found" });

    if (session.role === "MANAGER" && session.department) {
      if (doc.employeeId?.department !== session.department) {
        return res.status(403).json({ error: "Not allowed for this department" });
      }
    }

    doc.status = status;
    doc.reviewedByUserId = session.userId;
    doc.reviewedAt = new Date();
    await doc.save();

    const emp = await Employee.findById(doc.employeeId._id).lean();
    if (emp?.userId) {
      await Notification.create({
        userId: emp.userId,
        type: "OVERTIME_STATUS",
        title: "Overtime request updated",
        body: `Your overtime request is now ${status}.`,
        meta: { overtimeId: doc._id.toString() },
      });
    }

    await logAudit({
      req,
      action: status === "APPROVED" ? "OVERTIME_REQUEST_APPROVE" : "OVERTIME_REQUEST_REJECT",
      entityType: "OvertimeRequest",
      entityId: doc._id.toString(),
      details: {},
    });

    return res.json({ success: true, data: doc });
  } catch {
    return res.status(500).json({ error: "Failed to update overtime request" });
  }
};

