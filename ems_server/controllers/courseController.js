import Course from "../models/Course.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import PDFDocument from 'pdfkit';
import { v2 as cloudinary } from 'cloudinary';

const parseDurationMinutes = (duration = "") => {
  const hoursMatch = duration.match(/(\d+)\s*h/i);
  const minsMatch = duration.match(/(\d+)\s*m/i);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minsMatch ? Number(minsMatch[1]) : 0;
  return hours * 60 + minutes;
};

const CERTIFICATE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCertificateToCloudinary = async (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'course-certificates',
        public_id: fileName.replace(/\.pdf$/i, ''),
        format: 'pdf',
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

const notifyAdmins = async (payload) => {
  const admins = await User.find({ role: 'ADMIN' }).select('_id').lean();
  if (!admins.length) return;
  const notifications = admins.map((admin) => ({
    ...payload,
    userId: admin._id,
  }));
  await Notification.insertMany(notifications);
};

const isCertificateExpired = (entry) => {
  if (!entry?.certificateGeneratedAt) return false;
  return Date.now() - new Date(entry.certificateGeneratedAt).getTime() > CERTIFICATE_TTL_MS;
};

const clearCertificateEntry = (entry) => {
  entry.certificatePath = null;
  entry.certificateFileName = null;
  entry.certificateMimeType = null;
  entry.certificateGeneratedAt = null;
};

const pruneCourseCertificates = (course) => {
  let modified = false;
  for (const entry of course.enrolled || []) {
    if (isCertificateExpired(entry)) {
      clearCertificateEntry(entry);
      modified = true;
    }
  }
  return modified;
};

const generateCertificatePdf = async ({ course, studentName, completedAt }) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  const finished = new Promise((resolve, reject) => {
    doc.on('end', resolve);
    doc.on('error', reject);
  });

  doc.fontSize(22).text('Certificate of Completion', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(14).text(`This certifies that ${studentName} has successfully completed the course:`, { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(18).text(`${course.title}`, { align: 'center', underline: true });
  doc.moveDown(2);
  doc.fontSize(12).text(`Completed on: ${completedAt.toDateString()}`, { align: 'center' });
  doc.end();

  await finished;
  return Buffer.concat(chunks);
};

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

    const generatedFilter = String(req.query.generated || '').toLowerCase();
    if (generatedFilter === 'true') {
      filter.generatedByAI = true;
    } else if (generatedFilter === 'false') {
      filter.generatedByAI = false;
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

export const getCourseStats = async (req, res) => {
  try {
    const { role, userId, department } = req.session;
    const normalizedRole = String(role || '').toUpperCase();

    if (normalizedRole === 'ADMIN') {
      const courseStats = await Course.aggregate([
        {
          $group: {
            _id: null,
            totalCourses: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            totalEnrollments: { $sum: { $size: { $ifNull: ['$enrolled', []] } } },
            totalCompleted: {
              $sum: {
                $size: {
                  $filter: {
                    input: { $ifNull: ['$enrolled', []] },
                    as: 'entry',
                    cond: { $eq: ['$$entry.completed', true] },
                  },
                },
              },
            },
            totalCertificates: {
              $sum: {
                $size: {
                  $filter: {
                    input: { $ifNull: ['$enrolled', []] },
                    as: 'entry',
                    cond: {
                      $and: [
                        { $eq: ['$$entry.completed', true] },
                        { $ne: ['$$entry.certificatePath', null] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      ]);

      const summary = courseStats[0] || {};
      const totalCourses = summary.totalCourses || 0;
      const totalEnrollments = summary.totalEnrollments || 0;
      const totalCompleted = summary.totalCompleted || 0;
      const completionRate = totalEnrollments ? Math.round((totalCompleted / totalEnrollments) * 100) : 0;
      const avgRating = summary.avgRating ? Number(summary.avgRating.toFixed(1)) : 0;
      const totalEmployees = await User.countDocuments({ role: 'EMPLOYEE' });

      return res.json({
        role: normalizedRole,
        stats: [
          { key: 'totalCourses', value: totalCourses },
          { key: 'totalEmployees', value: totalEmployees },
          { key: 'completionRate', value: `${completionRate}%` },
          { key: 'avgRating', value: avgRating.toString() },
        ],
      });
    }

    if (normalizedRole === 'MANAGER') {
      const teamMembers = await User.countDocuments({ role: 'EMPLOYEE', department });
      const teamUsers = await User.find({ role: 'EMPLOYEE', department }).select('_id').lean();
      const teamUserIds = teamUsers.map((user) => user._id);

      const enrollmentStats = await Course.aggregate([
        { $unwind: { path: '$enrolled', preserveNullAndEmptyArrays: true } },
        { $match: { 'enrolled.user': { $in: teamUserIds } } },
        {
          $group: {
            _id: null,
            totalProgress: { $sum: { $ifNull: ['$enrolled.progress', 0] } },
            totalEnrollments: { $sum: { $cond: [{ $ifNull: ['$enrolled.user', false] }, 1, 0] } },
            completedCount: { $sum: { $cond: [{ $eq: ['$enrolled.completed', true] }, 1, 0] } },
          },
        },
      ]);

      const statsData = enrollmentStats[0] || { totalProgress: 0, totalEnrollments: 0, completedCount: 0 };
      const teamProgress = statsData.totalEnrollments ? Math.round(statsData.totalProgress / statsData.totalEnrollments) : 0;
      const pendingReviews = Math.max(0, statsData.totalEnrollments - statsData.completedCount);
      const topPerformance = statsData.totalEnrollments ? Math.round((statsData.completedCount / statsData.totalEnrollments) * 100) : 0;

      return res.json({
        role: normalizedRole,
        stats: [
          { key: 'teamMembers', value: teamMembers },
          { key: 'teamProgress', value: `${teamProgress}%` },
          { key: 'pendingReviews', value: pendingReviews },
          { key: 'topPerformance', value: `${topPerformance}%` },
        ],
      });
    }

    const courses = await Course.find({ 'enrolled.user': userId }).lean();
    const enrolledCourses = courses.length;
    let completedCourses = 0;
    let certificates = 0;
    let totalMinutes = 0;

    for (const course of courses) {
      const entry = (course.enrolled || []).find((e) => String(e.user) === String(userId));
      if (!entry) continue;
      if (entry.completed) completedCourses += 1;
      if (entry.certificatePath) certificates += 1;
      totalMinutes += parseDurationMinutes(course.duration);
    }

    const learningHours = Number((totalMinutes / 60).toFixed(1));

    return res.json({
      role: normalizedRole,
      stats: [
        { key: 'enrolledCourses', value: enrolledCourses },
        { key: 'completedCourses', value: completedCourses },
        { key: 'certificates', value: certificates },
        { key: 'learningHours', value: learningHours.toString() },
      ],
    });
  } catch (error) {
    console.error('getCourseStats error', error);
    return res.status(500).json({ error: 'Failed to load course stats' });
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
      generatedByAI: Boolean(req.body.generatedByAI || false),
      generatedFrom: req.body.generatedFrom || null,
      createdBy: req.session.userId,
    });

    await notifyAdmins({
      type: "COURSE_CREATED",
      title: "New course created",
      body: `A new course titled "${course.title}" has been created.
      `,
      meta: { courseId: course._id.toString(), createdBy: req.session.userId },
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

    try {
      const student = await User.findById(userId).lean();
      const studentName = student?.firstName || student?.email || 'Employee';
      const fileName = `certificate-${course._id}-${userId}.pdf`;
      const pdfBuffer = await generateCertificatePdf({
        course,
        studentName,
        completedAt: entry.completedAt,
      });

      const uploadResult = await uploadCertificateToCloudinary(pdfBuffer, fileName);
      entry.certificatePath = uploadResult.secure_url;
      entry.certificateFileName = fileName;
      entry.certificateMimeType = 'application/pdf';
      entry.certificateGeneratedAt = new Date();

      await Notification.create({
        userId,
        type: "CERTIFICATE_GENERATED",
        title: "Certificate generated",
        body: `Your certificate for ${course.title} is ready to download.`,
        meta: { courseId: course._id.toString() },
      });

      await notifyAdmins({
        type: "CERTIFICATE_GENERATED_ADMIN",
        title: "Certificate generated",
        body: `${studentName} completed ${course.title} and a certificate was generated.`,
        meta: { courseId: course._id.toString(), userId: userId.toString() },
      });
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
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    let targetUserId = req.session.userId;
    if (req.session.role === 'ADMIN' && req.query?.userId) {
      targetUserId = req.query.userId;
    }

    const entry = (course.enrolled || []).find((e) => String(e.user) === String(targetUserId));
    if (!entry) return res.status(403).json({ error: 'Not enrolled' });
    if (!entry.completed) return res.status(400).json({ error: 'Course not completed' });
    if (isCertificateExpired(entry)) {
      clearCertificateEntry(entry);
      await course.save();
      return res.status(404).json({ error: 'Certificate expired after 7 days' });
    }
    if (!entry.certificatePath) return res.status(404).json({ error: 'Certificate not found' });

    const remoteResponse = await fetch(entry.certificatePath);
    if (!remoteResponse.ok) {
      return res.status(502).json({ error: 'Failed to retrieve certificate' });
    }

    res.setHeader('Content-Type', entry.certificateMimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${entry.certificateFileName || 'certificate.pdf'}"`);
    return remoteResponse.body.pipe(res);
  } catch (error) {
    console.error('getCertificate error', error);
    return res.status(500).json({ error: 'Failed to fetch certificate' });
  }
};

export const regenerateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUserId = req.session.userId;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const entry = course.enrolled.find((e) => String(e.user) === String(targetUserId));
    if (!entry) return res.status(403).json({ error: 'Not enrolled' });

    try {
      const student = await User.findById(targetUserId).lean();
      const studentName = student?.firstName || student?.email || 'Employee';
      const fileName = `certificate-${course._id}-${targetUserId}.pdf`;
      const pdfBuffer = await generateCertificatePdf({
        course,
        studentName,
        completedAt: entry.completedAt || new Date(),
      });

      const uploadResult = await uploadCertificateToCloudinary(pdfBuffer, fileName);
      entry.certificatePath = uploadResult.secure_url;
      entry.certificateFileName = fileName;
      entry.certificateMimeType = 'application/pdf';
      entry.certificateGeneratedAt = new Date();
      await course.save();

      await Notification.create({
        userId: targetUserId,
        type: "CERTIFICATE_REGENERATED",
        title: "Certificate regenerated",
        body: `Your certificate for ${course.title} has been regenerated.`,
        meta: { courseId: course._id.toString() },
      });

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

    const courses = await Course.find({ 'enrolled.user': userId }).populate('createdBy', 'email');
    const mapped = [];
    for (const course of courses) {
      const entry = (course.enrolled || []).find((x) => String(x.user) === String(userId)) || {};
      if (isCertificateExpired(entry)) {
        clearCertificateEntry(entry);
        await course.save();
      }
      mapped.push({
        ...course.toObject(),
        id: course._id.toString(),
        enrolledInfo: {
          progress: entry.progress || 0,
          completed: entry.completed || false,
          enrolledAt: entry.enrolledAt,
          completedAt: entry.completedAt,
          certificatePath: entry.certificatePath || null,
          certificateGeneratedAt: entry.certificateGeneratedAt || null,
        }
      });
    }

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
