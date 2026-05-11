import { Router } from "express";
import { changePassword, forgotPassword, login, resetPassword, session } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/login", login)
authRouter.get("/session", protect, session)
authRouter.post("/change-password", protect, changePassword)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)

export default authRouter;

