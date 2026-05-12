import { Router } from "express";
import { protect, protectAdmin, protectAdminOrManager } from "../middleware/auth.js";
import { createLeave, getLeaves, updateLeaveStatus } from "../controllers/leaveController.js";
import { getLeaveBalanceByEmployee, getMyLeaveBalance, updateLeaveBalance } from "../controllers/leaveBalanceController.js";


const leaveRouter = Router();

leaveRouter.post("/", protect, createLeave)
leaveRouter.get("/", protect, getLeaves)
leaveRouter.get("/balance", protect, getMyLeaveBalance)
leaveRouter.get("/balances", protect, protectAdmin, getLeaveBalanceByEmployee)
leaveRouter.patch("/balances/:employeeId", protect, protectAdmin, updateLeaveBalance)
leaveRouter.patch("/:id", protect,protectAdminOrManager,updateLeaveStatus)

export default leaveRouter