import Employee from "../models/Employee.js";

//Get profile
//GET /api/profile
export const getProfile = async (req, res) =>{
    try {
        const session = req.session;
        const employee = await Employee.findOne({userId: session.userId})

        if (employee) {
            return res.json(employee);
        }

        if (session.role === "ADMIN") {
            return res.json({
                firstName: "Admin",
                lastName: "User",
                email: session.email,
                position: "Administrator",
                bio: "",
                isDeleted: false,
            });
        }

        if (session.role === "MANAGER") {
            return res.json({
                firstName: "Manager",
                lastName: "",
                email: session.email,
                position: session.department
                    ? `Department Manager · ${session.department}`
                    : "Manager",
                bio: "",
                isDeleted: false,
            });
        }

        return res.status(404).json({ error: "Employee profile not found" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
}

//Update profile
//PUT /api/profile
export const updateProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({userId: session.userId})

        if (!employee) {
            if (["ADMIN", "MANAGER"].includes(session.role)) {
                return res.json({ success: true, skipped: true });
            }
            return res.status(404).json({ error: "Employee not found" });
        }
        if (employee.isDeleted){
            return res.status(403).json({error: "Your account is deactivated. You cannot update your profile"})
        }
        await Employee.findByIdAndUpdate(employee._id, {
            bio: req.body.bio
        })
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update profile" });

    }
}