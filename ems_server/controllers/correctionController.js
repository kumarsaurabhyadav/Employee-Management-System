import Attendance from "../models/Attendance.js";
import AttendanceCorrectionRequest from "../models/AttendanceCorrectionRequest.js";
import AuditLog from "../models/AuditLog.js";
import Employee from "../models/Employee.js";
import Notification from "../models/Notification.js";
import ShiftPolicy from "../models/ShiftPolicy.js";
import User from "../models/User.js";

const toDay = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  dt.setHours(0, 0, 0, 0);
  return dt;
};

const dayRange = (d) => {
  const start = toDay(d);
  if (!start) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
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

const recalculateAttendanceMetrics = async (attendance, employee) => {
  if (!attendance.checkIn || !attendance.checkOut) return;

  const checkInTime = new Date(attendance.checkIn).getTime();
  const checkOutTime = new Date(attendance.checkOut).getTime();
  const diffMs = checkOutTime - checkInTime;
  const diffHours = diffMs / (1000 * 60 * 60);

  const workingHours = parseFloat(diffHours.toFixed(2));
  let dayType = "Short Day";

  if (workingHours >= 8) {
    dayType = "Full Day";
  } else if (workingHours >= 6) {
    dayType = "Three Quarter Day";
  } else if (workingHours >= 4) {
    dayType = "Half Day";
  }

  attendance.workingHours = workingHours;
  attendance.dayType = dayType;

  // Recalculate status based on checkIn and shift policy
  const policy = await ShiftPolicy.findOne({ department: employee.department }).lean();
  const shiftStartMinutes = policy?.shiftStartMinutes ?? 9 * 60;
  const lateGraceMinutes = policy?.lateGraceMinutes ?? 15;

  const shiftStart = new Date(attendance.date);
  shiftStart.setHours(
    Math.floor(shiftStartMinutes / 60),
    shiftStartMinutes % 60,
    0,
    0,
  );
  const lateAfter = new Date(shiftStart.getTime() + lateGraceMinutes * 60 * 1000);
  const isLate = new Date(attendance.checkIn).getTime() > lateAfter.getTime();

  attendance.status = isLate ? "LATE" : "PRESENT";
};

// POST /api/corrections
export const createCorrectionRequest = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId }).lean();
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    if (employee.isDeleted) {
      return res.status(403).json({ error: "Your account is deactivated." });
    }

    const { date, requestedCheckIn, requestedCheckOut, reason } = req.body;
    const day = toDay(date);
    if (!day) return res.status(400).json({ error: "Invalid date" });
    if (!reason) return res.status(400).json({ error: "Reason is required" });

    const range = dayRange(day);
    const existingForDay = await AttendanceCorrectionRequest.findOne({
      employeeId: employee._id,
      date: { $gte: range.start, $lt: range.end },
    }).lean();
    if (existingForDay) {
      return res.status(409).json({
        error:
          existingForDay.status === "PENDING"
            ? "A correction request for this date is already pending review"
            : "This attendance date already has a correction request (only one request per day is allowed)",
      });
    }

    const reqIn = requestedCheckIn ? new Date(requestedCheckIn) : null;
    const reqOut = requestedCheckOut ? new Date(requestedCheckOut) : null;
    if (reqIn && Number.isNaN(reqIn.getTime())) return res.status(400).json({ error: "Invalid requestedCheckIn" });
    if (reqOut && Number.isNaN(reqOut.getTime())) return res.status(400).json({ error: "Invalid requestedCheckOut" });

    const doc = await AttendanceCorrectionRequest.create({
      employeeId: employee._id,
      date: day,
      requestedCheckIn: reqIn,
      requestedCheckOut: reqOut,
      reason,
    });

    await logAudit({
      req,
      action: "CORRECTION_REQUEST_CREATE",
      entityType: "AttendanceCorrectionRequest",
      entityId: doc._id.toString(),
      details: { date: day.toISOString() },
    });

    // Notify approvers (admins and managers for the department)
    const approvers = await User.find({
      $or: [
        { role: "ADMIN" },
        { role: "MANAGER", department: employee.department },
      ],
    }).lean();

    for (const approver of approvers) {
      await Notification.create({
        userId: approver._id,
        type: "CORRECTION_REQUEST",
        title: "New attendance correction request",
        body: `${employee.firstName} ${employee.lastName} has submitted an attendance correction request for ${day.toDateString()}.`,
        meta: { correctionId: doc._id.toString(), employeeId: employee._id.toString() },
      });
    }

    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create request" });
  }
};

// GET /api/corrections
export const listCorrectionRequests = async (req, res) => {
  try {
    const session = req.session;
    const isAdminOrManager = ["ADMIN", "MANAGER"].includes(session.role);
    const status = req.query.status;

    // Own requests only (e.g. Attendance page) — avoids admin/manager seeing company-wide rows mixed into personal UI
    if (req.query.mine === "1") {
      const employee = await Employee.findOne({ userId: session.userId }).lean();
      if (!employee) return res.json({ data: [] });
      const where = { employeeId: employee._id };
      if (status) where.status = status;
      const data = await AttendanceCorrectionRequest.find(where)
        .sort({ createdAt: -1 })
        .lean();
      return res.json({ data });
    }

    if (isAdminOrManager) {
      const where = status ? { status } : {};
      const rows = await AttendanceCorrectionRequest.find(where)
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

    // Employee: list own requests
    const employee = await Employee.findOne({ userId: session.userId }).lean();
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    const where = { employeeId: employee._id };
    if (status) where.status = status;
    const data = await AttendanceCorrectionRequest.find(where)
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// PATCH /api/corrections/:id
export const reviewCorrectionRequest = async (req, res) => {
  try {
    const session = req.session;
    if (!["ADMIN", "MANAGER"].includes(session.role)) {
      return res.status(403).json({ error: "Admin/Manager access required" });
    }

    const { status } = req.body;
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const doc = await AttendanceCorrectionRequest.findById(req.params.id).populate("employeeId");
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

    if (status === "APPROVED") {
      const range = dayRange(doc.date);
      let attendance = await Attendance.findOne({
        employeeId: doc.employeeId._id,
        date: { $gte: range.start, $lt: range.end },
      });

      if (!attendance) {
        attendance = new Attendance({
          employeeId: doc.employeeId._id,
          date: range.start,
        });
      }

      attendance.checkIn = doc.requestedCheckIn ?? attendance.checkIn ?? null;
      attendance.checkOut = doc.requestedCheckOut ?? attendance.checkOut ?? null;

      // Recalculate working hours, day type, and status
      await recalculateAttendanceMetrics(attendance, doc.employeeId);

      await attendance.save();

      await logAudit({
        req,
        action: "CORRECTION_REQUEST_APPROVE",
        entityType: "Attendance",
        entityId: attendance._id.toString(),
        details: { correctionRequestId: doc._id.toString() },
      });
    } else {
      await logAudit({
        req,
        action: "CORRECTION_REQUEST_REJECT",
        entityType: "AttendanceCorrectionRequest",
        entityId: doc._id.toString(),
        details: {},
      });
    }

    const emp = await Employee.findById(doc.employeeId._id).lean();
    if (emp?.userId) {
      await Notification.create({
        userId: emp.userId,
        type: "CORRECTION_STATUS",
        title: "Attendance correction updated",
        body: `Your attendance correction request is now ${status}.`,
        meta: { correctionId: doc._id.toString() },
      });
    }

    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update request" });
  }
};

