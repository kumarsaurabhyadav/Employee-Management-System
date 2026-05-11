import mongoose from "mongoose";
import { DEPARTMENTS } from "../constants/departments.js";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type:String, enum: ["ADMIN","MANAGER","EMPLOYEE"], default: "EMPLOYEE" },
    department: { type: String, enum: DEPARTMENTS, default: null },
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpiresAt: { type: Date, default: null },
},{timestamps: true})

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User;