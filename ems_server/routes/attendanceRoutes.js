import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { clockInOut, getAttendance, checkCompletedAttendance } from "../controllers/attendanceController.js";

const attendaceRouter = Router();

attendaceRouter.post('/', protect, clockInOut)
attendaceRouter.get('/', protect, getAttendance)
attendaceRouter.get('/check-completed', protect, checkCompletedAttendance)

export default attendaceRouter;