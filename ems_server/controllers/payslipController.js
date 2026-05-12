import Employee from "../models/Employee.js";
import Payslip from "../models/Payslip.js";
import OvertimeRequest from "../models/OvertimeRequest.js";
import { inngest } from "../inngest/index.js";

// Create payslip
// POST /api/payslips
export const createPayslip = async (req, res) => {
  try {
    const session = req.session || {};
    const { employeeId, month, year, basicSalary, allowances, deductions } =
      req.body;
    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (session.role === "MANAGER" && session.department) {
      const target = await Employee.findById(employeeId).lean();
      if (!target || target.department !== session.department) {
        return res.status(403).json({
          error: "You can only generate payslips for employees in your department",
        });
      }
    }

    const monthNum = Number(month);
    const yearNum = Number(year);

    // Overtime integration (sum approved OT for employee in given month/year)
    const start = new Date(yearNum, monthNum - 1, 1);
    const end = new Date(yearNum, monthNum, 1);
    const otRows = await OvertimeRequest.find({
      employeeId,
      status: "APPROVED",
      date: { $gte: start, $lt: end },
    }).lean();

    const overtimeHours = otRows.reduce((sum, r) => sum + Number(r.hours || 0), 0);
    const avgMultiplier =
      otRows.length > 0
        ? otRows.reduce((sum, r) => sum + Number(r.rateMultiplier || 1.5), 0) /
          otRows.length
        : 1.5;

    const emp = await Employee.findById(employeeId).lean();
    const monthlySalary = Number(emp?.basicSalary || basicSalary);
    const hourlyRate = monthlySalary / (22 * 8);
    const overtimePay = Number((overtimeHours * hourlyRate * avgMultiplier).toFixed(2));

    const netSalary =
      Number(basicSalary) +
      Number(allowances || 0) +
      overtimePay -
      Number(deductions || 0);

    const payslip = await Payslip.create({
      employeeId,
      month: monthNum,
      year: yearNum,
      basicSalary: Number(basicSalary),
      allowances: Number(allowances || 0),
      deductions: Number(deductions || 0),
      overtimeHours,
      overtimePay,
      netSalary,
    });

    await inngest.send({
      name: "payslip/generated",
      data: { payslipId: payslip._id.toString() },
    });

    return res.json({ success: true, data: payslip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// Get payslips
// GET /api/payslips
export const getPayslips = async (req, res) => {
  try {
    const session = req.session || {};
    const role = session?.role;

    const mapPayslips = (payslips) =>
      payslips.map((p) => {
        const obj = p.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id?.toString(),
        };
      });

    if (role === "ADMIN") {
      const payslips = await Payslip.find()
        .populate("employeeId")
        .sort({ createdAt: -1 });
      return res.json({ data: mapPayslips(payslips) });
    }

    if (role === "MANAGER" && session.department) {
      const team = await Employee.find({
        department: session.department,
        isDeleted: { $ne: true },
      })
        .select("_id")
        .lean();
      const ids = team.map((e) => e._id);
      const payslips = await Payslip.find({ employeeId: { $in: ids } })
        .populate("employeeId")
        .sort({ createdAt: -1 });
      return res.json({ data: mapPayslips(payslips) });
    }

    const employee = await Employee.findOne({ userId: session.userId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const payslips = await Payslip.find({ employeeId: employee._id })
      .populate("employeeId")
      .sort({ createdAt: -1 });

    return res.json({ data: payslips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// Get single payslip
// GET /api/payslips/:id
const canAccessPayslip = async (session, payslip) => {
  if (!payslip?.employeeId) return false;
  const emp =
    typeof payslip.employeeId === "object" && payslip.employeeId._id
      ? payslip.employeeId
      : await Employee.findById(payslip.employeeId).lean();
  if (!emp) return false;
  if (session.role === "ADMIN") return true;
  if (session.role === "MANAGER" && session.department) {
    return emp.department === session.department;
  }
  const viewer = await Employee.findOne({ userId: session.userId }).lean();
  return viewer && String(viewer._id) === String(emp._id || emp);
};

export const getPayslipById = async (req, res) => {
  try {
    const session = req.session || {};
    const payslip = await Payslip.findById(req.params.id)
      .populate("employeeId")
      .lean();

    if(!payslip) return res.status(404).json({ error: "Not found" });

    const allowed = await canAccessPayslip(session, payslip);
    if (!allowed) return res.status(403).json({ error: "Access denied" });

    const result = {
      ...payslip,
      id: payslip._id.toString(),
      employee: payslip.employeeId,
    }
    return res.json(result)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// GET /api/payslips/:id/html
export const getPayslipHtml = async (req, res) => {
  try {
    const session = req.session || {};
    const payslip = await Payslip.findById(req.params.id)
      .populate("employeeId")
      .lean();
    if (!payslip) return res.status(404).send("Not found");

    const allowed = await canAccessPayslip(session, payslip);
    if (!allowed) return res.status(403).send("Access denied");

    const employee = payslip.employeeId;
    const monthLabel = `${payslip.month}/${payslip.year}`;

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Payslip ${monthLabel}</title>
    <style>
      body{font-family: Arial, sans-serif; padding: 24px; color:#111;}
      h1{margin:0 0 8px 0;}
      .muted{color:#555;}
      table{width:100%; border-collapse: collapse; margin-top:16px;}
      th,td{border:1px solid #ddd; padding:10px; text-align:left;}
      th{background:#f5f5f5;}
      .right{text-align:right;}
    </style>
  </head>
  <body>
    <h1>Payslip</h1>
    <div class="muted">${monthLabel}</div>
    <p><strong>Employee:</strong> ${employee?.firstName || ""} ${employee?.lastName || ""} (${employee?.email || ""})</p>
    <table>
      <tr><th>Earnings</th><th class="right">Amount</th></tr>
      <tr><td>Basic Salary</td><td class="right">${Number(payslip.basicSalary || 0).toFixed(2)}</td></tr>
      <tr><td>Allowances</td><td class="right">${Number(payslip.allowances || 0).toFixed(2)}</td></tr>
      <tr><td>Overtime Pay (${Number(payslip.overtimeHours || 0).toFixed(2)}h)</td><td class="right">${Number(payslip.overtimePay || 0).toFixed(2)}</td></tr>
      <tr><th>Deductions</th><th class="right"></th></tr>
      <tr><td>Deductions</td><td class="right">${Number(payslip.deductions || 0).toFixed(2)}</td></tr>
      <tr><th>Net Salary</th><th class="right">${Number(payslip.netSalary || 0).toFixed(2)}</th></tr>
    </table>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  } catch (error) {
    return res.status(500).send("Failed");
  }
};
