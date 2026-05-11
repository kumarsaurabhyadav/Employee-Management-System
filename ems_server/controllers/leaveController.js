import { inngest } from "../inngest/index.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import LeaveBalance from "../models/LeaveBalance.js";
import Notification from "../models/Notification.js";

const ensureBalance = async (employeeId) => {
    const existing = await LeaveBalance.findOne({ employeeId });
    if (existing) return existing;
    return await LeaveBalance.create({ employeeId });
}

const calcDaysInclusive = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
}

const balanceFieldForType = (type) => {
    if (type === "ANNUAL") return "annual";
    if (type === "CASUAL") return "casual";
    return "sick";
}

// Create leave
// POST /api/leaves
export const createLeave = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({userId: session.userId})
        if(!employee) return res.status(404).json({ error: "Employee not found" });
        if(employee.isDeleted){
            return res.status(403).json({
                error: "Your account is deactivated. You cannot apply for leave.",
            })
        }

        const { type, startDate, endDate, reason } = req.body;

        if(!type || !startDate || !endDate || !reason){
        return res.status(400).json({ error: "Missing fields" });
        }

        const today = new Date();
        today.setHours(0,0,0,0);
        if(new Date(startDate) <= today || new Date(endDate) <= today){
        return res.status(400).json({ error: "Leave dates must be in the future" });
        }

        if(new Date(endDate) < new Date(startDate)){
        return res.status(400).json({ error: "End date cannot be before start date" });
        }

        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "PENDING",
        })

        await inngest.send({
            name: "leave/pending",
            data: { leaveApplicationId: leave._id }
        })

        return res.json({ success: true, data: leave })

    } catch (error){
        return res.status(500).json({ error: "Failed" });
    } 
}  

// Get leaves
// GET /api/leaves
export const getLeaves = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role == "ADMIN";
        const isManager = session.role == "MANAGER";
        if(isAdmin || isManager){
            const status = req.query.status;
            const where = status ? {status} : {};
            const leaves = await LeaveApplication.find(where).populate("employeeId").sort({createdAt: -1});
            const filtered = isManager && session.department
                ? leaves.filter((l)=> l.employeeId?.department === session.department)
                : leaves;

            const data = filtered.map((l)=>{
                const obj = l.toObject();
                return{
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString(),  
                }
            })
            return res.json({data})
        }else{
            const employee = await Employee.findOne({
                userId: session.userId,
            }).lean();
            if(!employee) return res.status(404).json({ error: "Not found" });
            const leaves = await LeaveApplication.find({
                employeeId: employee._id
            }).sort({ createdAt: -1 });
            return res.json({
                data: leaves,
                employee: {...employee, id: employee._id.toString()}
            })
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed" });
    }
}

// Update leave status
// PATCH /api/leaves/:id
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if(!["APPROVED", "REJECTED", "PENDING"].includes(status)){
            return res.status(400).json({ error: "Invalid status" });
        }
        const leave = await LeaveApplication.findById(req.params.id);
        if(!leave) return res.status(404).json({ error: "Not found" });

        // Only apply balance deduction when moving to APPROVED.
        if (status === "APPROVED" && leave.status !== "APPROVED") {
            const days = calcDaysInclusive(leave.startDate, leave.endDate);
            const field = balanceFieldForType(leave.type);

            const balance = await ensureBalance(leave.employeeId);
            const available = Number(balance[field] || 0);

            if (available >= days) {
                balance[field] = available - days;
                leave.paidDays = days;
                leave.unpaidDays = 0;
            } else {
                if (!balance.unpaidAllowed) {
                    return res.status(400).json({ error: `Insufficient ${field} leave balance` });
                }
                leave.paidDays = Math.max(available, 0);
                leave.unpaidDays = Math.max(days - available, 0);
                balance[field] = 0;
            }

            await balance.save();
        }

        leave.status = status;
        await leave.save();

        const emp = await Employee.findById(leave.employeeId).lean();
        if (emp?.userId) {
            await Notification.create({
                userId: emp.userId,
                type: "LEAVE_STATUS",
                title: "Leave request updated",
                body: `Your leave request is now ${status}.`,
                meta: { leaveId: leave._id.toString() },
            });
        }
        return res.json({success: true, data:leave})
        
    } catch (error) {
        return res.status(500).json({ error: "Failed" });
    }
}