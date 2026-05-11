import { Inngest } from "inngest";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import Holiday from "../models/Holiday.js";
import LeaveBalance from "../models/LeaveBalance.js";
import Payslip from "../models/Payslip.js";
import Notification from "../models/Notification.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "fullstack-ems" });

// Auto check-out for employee
const autoCheckOut = inngest.createFunction(
  {
    id: "auto-check-out",
    triggers: [{ event: "employee/check-out" }],
  },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    //wait for 9 hours
    await step.sleepUntil(
      "wait-for-the-9-hours",
      new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    );

    //get Attendance data
    let attendance = await Attendance.findById(attendanceId);

    if (!attendance?.checkOut) {
      //get Employee data
      const employee = await Employee.findById(employeeId);

      // If employee is on approved leave today, don't send check-out reminders.
      const dayStart = new Date(attendance.date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const onLeave = await LeaveApplication.exists({
        employeeId,
        status: "APPROVED",
        startDate: { $lte: dayEnd },
        endDate: { $gte: dayStart },
      });
      if (onLeave) return;

      //send remainder email
      await sendEmail({
        to: employee.email,
        subject: "Attendance Check-Out Reminder",
        body: `<div style="max-width: 600px;">
        <h2>Hi ${employee.firstName}, 👋</h2>

        <p style="font-size: 16px;">
            You have a check-in in ${employee.department} today:
        </p>

        <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
            ${attendance?.checkIn?.toLocaleTimeString()}
        </p>

        <p style="font-size: 16px;">
            Please make sure to check-out in one hour.
        </p>

        <p style="font-size: 16px;">
            If you have any questions, please contact your admin.
        </p>

        <br />

        <p style="font-size: 16px;">Best Regards,</p>
        <p style="font-size: 16px;">EMS</p>
    </div>`,
      });
    }
  },
);

//Send email to admin, if admin doesn't take action on leave aplication within 24 hours
const leaveApplicationReminder = inngest.createFunction(
  {
    id: "leave-application-reminder",
    triggers: [{ event: "leave/pending" }],
  },
  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    //wait for 24 hours
    await step.sleepUntil(
      "wait-for-the-24-hours",
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    );

    const leaveApplication =
      await LeaveApplication.findById(leaveApplicationId);

    if (leaveApplication?.status === "PENDING") {
      const employee = await Employee.findById(leaveApplication.employeeId);

      //send reminder email to admin to take action on leave application
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Leave Application Reminder`,
        body: `<div style="max-width: 600px;">
        <h2>Hi Admin, 👋</h2>

        <p style="font-size: 16px;">
            You have a leave application in ${employee.department} today:
        </p>

        <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
            ${leaveApplication?.startDate?.toLocaleDateString()}
        </p>

        <p style="font-size: 16px;">
            Please make sure to take action on this leave application.
        </p>

        <br />

        <p style="font-size: 16px;">Best Regards,</p>
        <p style="font-size: 16px;">EMS</p>
    </div>`,
      });
    }
  },
);

//cron: check attendance at 11:30 AM IST (06:00 UTC) and email absent employees
const attendanceReminderCron = inngest.createFunction(
  {
    id: "attendance-reminder-cron",
    triggers: [{ cron: "TZ=Asia/Kolkata 30 11 * * *" }],
  },
  async ({ step }) => {
    //get today date range
    const today = await step.run("get-today-date", () => {
      const startUTC = new Date(
        new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) +
          "T00:00:00+05:30",
      );
      const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
      return { startUTC: startUTC.toISOString(), endUTC: endUTC.toISOString() };
    });
    //step 2: get all active, non-deleted employees
    const activeEmployees = await step.run("get-active-employees", async () => {
      const employees = await Employee.find({
        isDeleted: false,
        employmentStatus: "ACTIVE",
      }).lean();
      return employees.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    // Step 3: Get employee IDs on approved leave today
    const onLeaveIds = await step.run("get-on-leave-ids", async () => {
      const leaves = await LeaveApplication.find({
        status: "APPROVED",
        startDate: { $lte: new Date(today.endUTC) },
        endDate: { $gte: new Date(today.startUTC) },
      }).lean();

      return leaves.map((l) => l.employeeId.toString());
    });

    // Step 4: Get employee IDs who already checked in today
    const checkedInIds = await step.run("get-checked-in-ids", async () => {
      const attendances = await Attendance.find({
        date: {
          $gte: new Date(today.startUTC),
          $lt: new Date(today.endUTC),
        },
      }).lean();

      return attendances.map((a) => a.employeeId.toString());
    });

    // Step 5: Filter absent employees (not on leave & not checked in)
    const absentEmployees = activeEmployees.filter(
      (emp) =>
        !onLeaveIds.includes(emp._id.toString()) &&
        !checkedInIds.includes(emp._id.toString()),
    );

    // Step 5.25: Skip reminders on holidays
    const isHoliday = await step.run("check-holiday", async () => {
      const dayStart = new Date(today.startUTC);
      dayStart.setHours(0, 0, 0, 0);
      const exists = await Holiday.exists({ date: dayStart });
      return Boolean(exists);
    });
    if (isHoliday) {
      return {
        totalActive: activeEmployees.length,
        onLeave: onLeaveIds.length,
        checkedIn: checkedInIds.length,
        absent: absentEmployees.length,
        skipped: "HOLIDAY",
      };
    }

    // Step 5.5: Skip reminders on weekends (Asia/Kolkata)
    const isWeekend = await step.run("check-weekend", () => {
      const local = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      );
      const day = local.getDay(); // 0 Sun, 6 Sat
      return day === 0 || day === 6;
    });
    if (isWeekend) {
      return {
        totalActive: activeEmployees.length,
        onLeave: onLeaveIds.length,
        checkedIn: checkedInIds.length,
        absent: absentEmployees.length,
        skipped: "WEEKEND",
      };
    }

    // Step 6: Send reminder emails
    if (absentEmployees.length > 0) {
      await step.run("send-reminder-emails", async () => {
        await Promise.all(
          absentEmployees.map((emp) =>
            sendEmail({
            to: emp.email,
            subject: "Attendance Reminder - Please Mark Your Attendance",
            body: `
                            <div style="max-width: 600px; font-family: Arial, sans-serif;">
                                <h2>Hi ${emp.firstName}, 👋</h2>
                                <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
                                <p style="font-size: 16px;">The deadline was <strong>11:30 AM</strong> and your attendance is still missing.</p>
                                <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                                <br />
                                <p style="font-size: 14px; color: #666;">Department: ${emp.department}</p>
                                <br />
                                <p style="font-size: 16px;">Best Regards,</p>
                                <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
                            </div>
                        `,
            }),
          ),
        );

        return { emailsSent: absentEmployees.length };
      });
    }
  
    return {
      totalActive: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  },
);

// cron: monthly accrual of leave balances at 00:05 IST on 1st
const leaveAccrualCron = inngest.createFunction(
  {
    id: "leave-accrual-cron",
    triggers: [{ cron: "TZ=Asia/Kolkata 5 0 1 * *" }],
  },
  async ({ step }) => {
    const result = await step.run("apply-accrual", async () => {
      const balances = await LeaveBalance.find().lean();
      let updated = 0;

      for (const b of balances) {
        const next = {
          annual: (b.annual || 0) + (b.accrualMonthly?.annual || 0),
          casual: (b.casual || 0) + (b.accrualMonthly?.casual || 0),
          sick: (b.sick || 0) + (b.accrualMonthly?.sick || 0),
        };

        // Soft caps to avoid runaway; uses carryForwardCap as max balance
        next.annual = Math.min(next.annual, b.carryForwardCap?.annual ?? 30);
        next.casual = Math.min(next.casual, b.carryForwardCap?.casual ?? 12);
        next.sick = Math.min(next.sick, b.carryForwardCap?.sick ?? 12);

        await LeaveBalance.updateOne(
          { _id: b._id },
          { $set: { annual: next.annual, casual: next.casual, sick: next.sick } },
        );
        updated += 1;
      }

      return { updated };
    });

    return result;
  },
);

// Event: payslip generated -> email employee
const payslipGeneratedEmail = inngest.createFunction(
  {
    id: "payslip-generated-email",
    triggers: [{ event: "payslip/generated" }],
  },
  async ({ event, step }) => {
    const { payslipId } = event.data;

    const data = await step.run("fetch-payslip", async () => {
      const payslip = await Payslip.findById(payslipId).populate("employeeId").lean();
      if (!payslip) return null;
      return payslip;
    });

    if (!data) return { ok: false };

    const employee = data.employeeId;
    const monthLabel = `${data.month}/${data.year}`;
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const viewUrl = `${clientUrl}/print/payslips/${data._id.toString()}`;

    await step.run("send-email", async () => {
      await sendEmail({
        to: employee?.email,
        subject: `Payslip generated (${monthLabel})`,
        body: `
          <div style="max-width: 600px; font-family: Arial, sans-serif;">
            <h2>Hi ${employee?.firstName || "there"},</h2>
            <p>Your payslip for <strong>${monthLabel}</strong> has been generated.</p>
            <p style="margin: 24px 0;">
              <a href="${viewUrl}" style="background:#111827;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">
                View Payslip
              </a>
            </p>
            <p style="font-size: 14px; color: #666;">If you have questions, contact HR.</p>
          </div>
        `,
      });
    });

    await step.run("create-notification", async () => {
      const userId = employee?.userId;
      if (!userId) return;
      await Notification.create({
        userId,
        type: "PAYSLIP",
        title: "Payslip generated",
        body: `Your payslip for ${monthLabel} is available.`,
        meta: { payslipId: data._id.toString() },
      });
    });

    return { ok: true };
  },
);

// cron: daily unread notifications digest at 19:00 IST
const notificationsDigestCron = inngest.createFunction(
  {
    id: "notifications-digest-cron",
    triggers: [{ cron: "TZ=Asia/Kolkata 0 19 * * *" }],
  },
  async ({ step }) => {
    const unread = await step.run("fetch-unread", async () => {
      const rows = await Notification.find({ readAt: null })
        .sort({ createdAt: -1 })
        .limit(500)
        .lean();
      return rows;
    });

    // group by userId
    const byUser = new Map();
    for (const n of unread) {
      const key = n.userId.toString();
      const arr = byUser.get(key) || [];
      arr.push(n);
      byUser.set(key, arr);
    }

    // naive digest: skip if no ADMIN_EMAIL/CLIENT_URL; email only top 10 items
    await step.run("send-digests", async () => {
      const User = (await import("../models/User.js")).default;
      const users = await User.find({ _id: { $in: Array.from(byUser.keys()) } }).lean();
      const userById = new Map(users.map((u) => [u._id.toString(), u]));

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

      const tasks = Array.from(byUser.entries()).map(async ([uid, items]) => {
        const u = userById.get(uid);
        if (!u?.email) return;
        const lines = items
          .slice(0, 10)
          .map((i) => `<li><strong>${i.title}</strong>: ${i.body}</li>`)
          .join("");

        await sendEmail({
          to: u.email,
          subject: `You have ${items.length} unread notifications`,
          body: `
            <div style="max-width: 600px; font-family: Arial, sans-serif;">
              <h2>Notification digest</h2>
              <p>You have <strong>${items.length}</strong> unread notifications.</p>
              <ul>${lines}</ul>
              <p style="margin: 24px 0;">
                <a href="${clientUrl}/dashboard" style="background:#111827;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">
                  Open EMS
                </a>
              </p>
            </div>
          `,
        });
      });

      await Promise.all(tasks);
    });

    return { users: byUser.size, notifications: unread.length };
  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  autoCheckOut,
  leaveApplicationReminder,
  attendanceReminderCron,
  leaveAccrualCron,
  payslipGeneratedEmail,
  notificationsDigestCron,
];
