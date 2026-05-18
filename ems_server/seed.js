import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
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

        // create a sample employee for testing
        const employeeEmail = 'employee@text.com';
        const employeePassword = 'employee123';
        const existingEmployee = await User.findOne({ email: employeeEmail });
        if (!existingEmployee) {
            const empHash = await bcrypt.hash(employeePassword, 10);
            const emp = await User.create({
                email: employeeEmail,
                password: empHash,
                role: 'EMPLOYEE',
                department: 'Engineering'
            });
            console.log('\nEMPLOYEE user created');
            console.log('email:', emp.email);
            console.log('password:', employeePassword);
        } else {
            console.log('\nEMPLOYEE already exists as role', existingEmployee.role);
        }

        const courseCount = await Course.countDocuments();
        if (courseCount === 0) {
            await Course.insertMany([
                {
                    title: "Employee Onboarding Fundamentals",
                    description: "Complete guide for new employees covering company culture, policies, and standard procedures.",
                    category: "Onboarding",
                    duration: "2h 30m",
                    videos: 12,
                    students: 145,
                    status: "published",
                    rating: 4.8,
                },
                {
                    title: "Workplace Safety Training",
                    description: "Essential safety protocols and procedures for a secure and healthy work environment.",
                    category: "Safety",
                    duration: "1h 45m",
                    videos: 8,
                    students: 230,
                    status: "published",
                    rating: 4.9,
                },
                {
                    title: "Leadership Development",
                    description: "Advanced leadership skills and team management strategies for aspiring managers.",
                    category: "Leadership",
                    duration: "4h 15m",
                    videos: 15,
                    students: 67,
                    status: "published",
                    rating: 4.7,
                },
            ]);
            console.log("\nSample courses created.");
        } else {
            console.log(`\n${courseCount} courses already exist.`);
        }
        
        process.exit(0)
        
    } catch (error) {
        console.error("Seed failed:", error);
        
    }
}

registerAdmin();