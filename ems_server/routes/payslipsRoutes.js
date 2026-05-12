import { Router } from "express";
import { protect, protectAdmin, protectAdminOrManager } from "../middleware/auth.js";
import { createPayslip, getPayslipById, getPayslipHtml, getPayslips } from "../controllers/payslipController.js";



const payslipRouter = Router();

payslipRouter.post("/", protect, protectAdminOrManager, createPayslip)
payslipRouter.get("/", protect, getPayslips)
payslipRouter.get("/:id/html", protect, getPayslipHtml)
payslipRouter.get("/:id", protect, getPayslipById)


export default payslipRouter