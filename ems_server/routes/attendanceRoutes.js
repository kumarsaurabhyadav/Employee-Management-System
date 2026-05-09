import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { clockInOut, getAttendance } from "../controllers/attendanceController.js";

const attendaceRouter = Router();

attendaceRouter.post('/', protect, clockInOut)
attendaceRouter.get('/', protect, getAttendance)



export default attendaceRouter;