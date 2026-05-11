import Holiday from "../models/Holiday.js";

const toDay = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  dt.setHours(0, 0, 0, 0);
  return dt;
};

// GET /api/holidays
export const listHolidays = async (req, res) => {
  try {
    const year = req.query.year ? Number(req.query.year) : null;
    const where = {};
    if (year && Number.isFinite(year)) {
      where.date = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      };
    }
    const holidays = await Holiday.find(where).sort({ date: 1 }).lean();
    return res.json({ data: holidays });
  } catch {
    return res.status(500).json({ error: "Failed to fetch holidays" });
  }
};

// POST /api/holidays
export const createHoliday = async (req, res) => {
  try {
    const { date, name, type, appliesToDepartments } = req.body;
    const day = toDay(date);
    if (!day) return res.status(400).json({ error: "Invalid date" });
    if (!name) return res.status(400).json({ error: "Name is required" });

    const doc = await Holiday.create({
      date: day,
      name,
      type: type || "HOLIDAY",
      appliesToDepartments: Array.isArray(appliesToDepartments)
        ? appliesToDepartments
        : [],
    });
    return res.json({ success: true, data: doc });
  } catch (error) {
    if (String(error?.code) === "11000") {
      return res.status(409).json({ error: "Holiday already exists for this date" });
    }
    return res.status(500).json({ error: "Failed to create holiday" });
  }
};

// DELETE /api/holidays/:id
export const deleteHoliday = async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete holiday" });
  }
};

