import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";


const TemporaryPassword = "admin123";
const ManagerEmail = "manager@text.com";
const ManagerPassword = "12345678";

async function registerAdmin(){
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if(!ADMIN_EMAIL){
            console.error("Missing ADMIN_EMAIL env variable");
            process.exit(1);
            
        }

        await connectDB()

        const existingAdmin = await User.findOne({email: process.env.ADMIN_EMAIL });

        if(!existingAdmin){
            const hashedPassword = await bcrypt.hash(TemporaryPassword, 10)

            const admin = await User.create({
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: "ADMIN",
            })

            console.log("ADMIN user created");
            console.log("\nemail:", admin.email);
            console.log("password:", TemporaryPassword);
            console.log("\nchange the password after login.");
        } else {
            console.log("ADMIN already exists as role", existingAdmin.role);
        }

        const existingManager = await User.findOne({ email: ManagerEmail });
        if(!existingManager){
            const managerHash = await bcrypt.hash(ManagerPassword, 10);
            const manager = await User.create({
                email: ManagerEmail,
                password: managerHash,
                role: "MANAGER",
                department: "Engineering",
            });
            console.log("\nMANAGER user created");
            console.log("email:", manager.email);
            console.log("password:", ManagerPassword);
        } else {
            console.log("\nMANAGER already exists as role", existingManager.role);
        }
        
        process.exit(0)
        
    } catch (error) {
        console.error("Seed failed:", error);
        
    }
}

registerAdmin();