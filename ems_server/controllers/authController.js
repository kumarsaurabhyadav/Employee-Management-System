import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import sendEmail from "../config/nodemailer.js";

//Login for employee and admin
//POST /api/auth/login
export const login = async (req, res) => {
    try {
        const {email, password, role_type} = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required "});
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({ error: "Invalid credentials "});
        }

        if(role_type === "admin" && user.role !== "ADMIN"){
           return res.status(401).json({ error: "Not authiorized as admin" }); 
        }

        if(role_type === "employee" && user.role !== "EMPLOYEE"){
            return res.status(401).json({ error: "Not authorized as employee" });
        }

        const isValid = await bcrypt.compare( password, user.password)
        if(!isValid){
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const payload = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email,

        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});

        return res.json({ user: payload, token });

    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json({error: "Login failed" });
    }
} 

//Get session for employee and admin
//Get /api/auth/session
export const session = (req, res) =>{
    const session = req.session;
    return res.json({user: session})
}

//Change password for employee and admin
//POST /api/auth/change-password
export const changePassword = async (req, res) => {
    try {
        const session = req.session;
        const { currentPassword , newPassword } = req.body;
        if(!currentPassword || !newPassword){
            return res.status(400).json({ error: "Both passwords are required" });
        }
        const user = await User.findById(session.userId)
        if(!user) return res.status(404).json({ error: "User not found" });

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if(!isValid) return res.status(400).json({ error: "Current password is incorrect"});
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(session.userId, {password:hashed})
        return res.json({success: true});

    } catch (error) {
        return res.status(500).json({ error: "Failed to change password" })
    }
}

// Forgot password (send reset link)
// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = await User.findOne({ email });

        // Always return success to avoid account enumeration
        if (!user) return res.json({ success: true });

        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetPasswordTokenHash = tokenHash;
        user.resetPasswordExpiresAt = expiresAt;
        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const resetUrl = `${clientUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

        await sendEmail({
            to: email,
            subject: "Reset your password",
            body: `
                <div style="max-width: 600px; font-family: Arial, sans-serif;">
                    <h2>Password reset request</h2>
                    <p>If you requested a password reset, click the button below. This link expires in 1 hour.</p>
                    <p style="margin: 24px 0;">
                        <a href="${resetUrl}" style="background:#111827;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">
                            Reset Password
                        </a>
                    </p>
                    <p style="font-size: 14px; color: #666;">If you didn't request this, you can ignore this email.</p>
                </div>
            `,
        });

        return res.json({ success: true });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ error: "Failed to send reset email" });
    }
};

// Reset password (verify token + set new password)
// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            return res.status(400).json({ error: "Email, token and newPassword are required" });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            email,
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpiresAt: { $gt: new Date() },
        });

        if (!user) return res.status(400).json({ error: "Invalid or expired reset token" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.resetPasswordTokenHash = null;
        user.resetPasswordExpiresAt = null;
        await user.save();

        return res.json({ success: true });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ error: "Failed to reset password" });
    }
};