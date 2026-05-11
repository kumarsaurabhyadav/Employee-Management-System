import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import attendaceRouter from "./routes/attendanceRoutes.js";
import leaveRouter from "./routes/leaveRoutes.js";
import payslipRouter from "./routes/payslipsRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import shiftRouter from "./routes/shiftPolicyRoutes.js";
import holidayRouter from "./routes/holidayRoutes.js";
import correctionRouter from "./routes/correctionRoutes.js";
import overtimeRouter from "./routes/overtimeRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express()
const PORT = process.env.PORT || 4000;


//middleware
app.use(cors())
app.use(express.json())
app.use(multer().none())

//Routes
app.get("/", (req, res)=> res.send("server is running"))
app.use("/api/auth", authRouter)
app.use("/api/employees", employeeRouter)
app.use("/api/profile", profileRouter)
app.use("/api/attendance", attendaceRouter)
app.use("/api/leave", leaveRouter)
app.use("/api/payslips", payslipRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/shifts", shiftRouter)
app.use("/api/holidays", holidayRouter)
app.use("/api/corrections", correctionRouter)
app.use("/api/overtime", overtimeRouter)
app.use("/api/notifications", notificationRouter)
app.use("/api/inngest", serve({ client: inngest, functions }));



await connectDB()

app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))