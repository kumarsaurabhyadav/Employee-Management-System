import Course from "../models/Course.js";
import User from "../models/User.js";
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const getCourses = async (req, res) => {
  try {
    const { role, department } = req.session;
    const filter = {};

    if (role === "EMPLOYEE") {
      filter.status = "published";
    }

    // search query support
    const { q } = req.query;
    if (q && typeof q === 'string' && q.trim().length > 0) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex }
      ];
    }

    const courses = await Course.find(filter).populate('createdBy', 'email').sort({ createdAt: -1 }).lean();

    return res.json(
      courses.map((course) => ({
        ...course,
        id: course._id.toString(),
      }))
    );
  } catch (error) {
    console.error("getCourses error", error);
    return res.status(500).json({ error: "Failed to load courses" });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, duration, videos, students, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Course title is required" });
    }

    const course = await Course.create({
      title,
      description: description || "",
      category: category || "General",
      duration: duration || "0h 0m",
      videos: Number(videos) || 0,
      students: Number(students) || 0,
      status: status || "draft",
      createdBy: req.session.userId,
    });

    return res.status(201).json({ success: true, course });
  } catch (error) {
    console.error("createCourse error", error);
    return res.status(500).json({ error: "Failed to create course" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, duration, videos, students, status } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.duration = duration || course.duration;
    course.videos = Number(videos) || course.videos;
    course.students = Number(students) || course.students;
    course.status = status || course.status;

    await course.save();

    return res.json({ success: true, course });
  } catch (error) {
    console.error("updateCourse error", error);
    return res.status(500).json({ error: "Failed to update course" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await course.deleteOne();
    return res.json({ success: true });
  } catch (error) {
    console.error("deleteCourse error", error);
    return res.status(500).json({ error: "Failed to delete course" });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const already = course.enrolled.find((e) => String(e.user) === String(userId));
    if (already) return res.json({ success: true, message: 'Already enrolled', course });

    course.enrolled.push({ user: userId });
    course.students = (course.students || 0) + 1;
    await course.save();

    return res.json({ success: true, course });
  } catch (error) {
    console.error('enrollCourse error', error);
    return res.status(500).json({ error: 'Failed to enroll' });
  }
};

export const completeCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const entry = course.enrolled.find((e) => String(e.user) === String(userId));
    if (!entry) return res.status(400).json({ error: 'Not enrolled' });

    entry.completed = true;
    entry.completedAt = new Date();
    entry.progress = 100;
    // generate certificate PDF and attach path to the enrolled entry
    try {
      const user = await User.findById(userId).lean();
      const certDir = path.join(process.cwd(), 'uploads', 'certificates');
      fs.mkdirSync(certDir, { recursive: true });
      const fileName = `certificate-${course._id}-${userId}.pdf`;
      const filePath = path.join(certDir, fileName);

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(22).text('Certificate of Completion', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(14).text(`This certifies that ${user.name || user.email} has successfully completed the course:`, { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(18).text(`${course.title}`, { align: 'center', underline: true });
      doc.moveDown(2);
      doc.fontSize(12).text(`Completed on: ${entry.completedAt.toDateString()}`, { align: 'center' });
      doc.end();

      // wait for stream to finish before proceeding
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      entry.certificatePath = filePath;
    } catch (certErr) {
      console.error('certificate generation failed', certErr);
    }
    await course.save();

    return res.json({ success: true, course });
  } catch (error) {
    console.error('completeCourse error', error);
    return res.status(500).json({ error: 'Failed to complete course' });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserId = req.query.userId;
    const targetUserId = adminUserId && req.session.role === 'ADMIN' ? adminUserId : req.session.userId;
    const course = await Course.findById(id).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const entry = (course.enrolled || []).find((e) => String(e.user) === String(targetUserId));
    if (!entry) return res.status(403).json({ error: 'Not enrolled' });
    if (!entry.completed) return res.status(400).json({ error: 'Course not completed' });
    if (!entry.certificatePath) return res.status(404).json({ error: 'Certificate not found' });

    return res.sendFile(entry.certificatePath);
  } catch (error) {
    console.error('getCertificate error', error);
    return res.status(500).json({ error: 'Failed to fetch certificate' });
  }
};

export const regenerateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    // allow admin to pass userId in body to regenerate for another user
    const targetUserId = req.body?.userId && req.session?.role === 'ADMIN' ? req.body.userId : req.session.userId;
    if (!targetUserId) return res.status(401).json({ error: 'Unauthorized' });

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const entry = course.enrolled.find((e) => String(e.user) === String(targetUserId));
    if (!entry) return res.status(403).json({ error: 'Not enrolled' });

    // generate certificate PDF
    try {
      const user = await User.findById(targetUserId).lean();
      const certDir = path.join(process.cwd(), 'uploads', 'certificates');
      fs.mkdirSync(certDir, { recursive: true });
      const fileName = `certificate-${course._id}-${targetUserId}.pdf`;
      const filePath = path.join(certDir, fileName);

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(22).text('Certificate of Completion', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(14).text(`This certifies that ${user.name || user.email} has successfully completed the course:`, { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(18).text(`${course.title}`, { align: 'center', underline: true });
      doc.moveDown(2);
      doc.fontSize(12).text(`Completed on: ${entry.completedAt ? new Date(entry.completedAt).toDateString() : new Date().toDateString()}`, { align: 'center' });
      doc.end();

      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      entry.certificatePath = filePath;
      await course.save();

      return res.json({ success: true, certificatePath: entry.certificatePath });
    } catch (err) {
      console.error('regenerate certificate failed', err);
      return res.status(500).json({ error: 'Certificate generation failed' });
    }
  } catch (error) {
    console.error('regenerateCertificate error', error);
    return res.status(500).json({ error: 'Failed to regenerate certificate' });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const courses = await Course.find({ 'enrolled.user': userId }).populate('createdBy', 'email').lean();
    const mapped = courses.map((course) => {
      const e = (course.enrolled || []).find((x) => String(x.user) === String(userId)) || {};
      return {
        ...course,
        id: course._id.toString(),
        enrolledInfo: {
          progress: e.progress || 0,
          completed: e.completed || false,
          enrolledAt: e.enrolledAt,
          completedAt: e.completedAt,
          certificatePath: e.certificatePath || null
        }
      };
    });

    return res.json(mapped);
  } catch (error) {
    console.error('getMyCourses error', error);
    return res.status(500).json({ error: 'Failed to load my courses' });
  }
};

export const getAllCertificates = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('createdBy', 'email').lean();
    const users = await User.find({}).select('email firstName lastName role').lean();
    const userMap = users.reduce((acc, user) => {
      acc[String(user._id)] = user;
      return acc;
    }, {});

    const records = courses.flatMap((course) => {
      return (course.enrolled || []).map((entry) => ({
        courseId: course._id.toString(),
        courseTitle: course.title,
        courseStatus: course.status,
        instructor: course.createdBy?.email || 'Instructor',
        userId: entry.user?.toString(),
        userEmail: userMap[String(entry.user)]?.email || 'Unknown',
        userName: `${userMap[String(entry.user)]?.firstName || ''} ${userMap[String(entry.user)]?.lastName || ''}`.trim(),
        enrolledAt: entry.enrolledAt,
        progress: entry.progress || 0,
        completed: entry.completed || false,
        completedAt: entry.completedAt,
        certificatePath: entry.certificatePath || null,
      }));
    });

    return res.json(records);
  } catch (error) {
    console.error('getAllCertificates error', error);
    return res.status(500).json({ error: 'Failed to load certificate records' });
  }
};
