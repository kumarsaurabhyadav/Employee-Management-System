import { Router } from "express";
import { createEmployees, deleteEmployees, getEmployees, updateEmployees } from "../controllers/employeeController.js";
import { protect, protectAdmin, protectAdminOrManager } from "../middleware/auth.js";

const employeeRouter = Router();

employeeRouter.get("/", protect, protectAdminOrManager,  getEmployees)
employeeRouter.post("/", protect, protectAdmin, createEmployees)
employeeRouter.put("/:id", protect, protectAdmin, updateEmployees)
employeeRouter.delete("/:id", protect, protectAdmin, deleteEmployees)

export default employeeRouter