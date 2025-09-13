// import { v2 as cloudinary } from 'cloudinary'
// import Course from '../models/Course.js';
// import { Purchase } from '../models/Purchase.js';
// import User from '../models/User.js';
// import { clerkClient } from '@clerk/express'

// // update role to educator
// export const updateRoleToEducator = async (req, res) => {

//     try {

//         const userId = req.auth.userId

//         await clerkClient.users.updateUserMetadata(userId, {
//             publicMetadata: {
//                 role: 'educator',
//             },
//         })

//         res.json({ success: true, message: 'You can publish a course now' })

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }

// }

// // Add New Course
// export const addCourse = async (req, res) => {

//     try {

//         const { courseData } = req.body

//         const imageFile = req.file

//         const educatorId = req.auth.userId

//         if (!imageFile) {
//             return res.json({ success: false, message: 'Thumbnail Not Attached' })
//         }

//         const parsedCourseData = await JSON.parse(courseData)

//         parsedCourseData.educator = educatorId

//         const newCourse = await Course.create(parsedCourseData)

//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)

//         newCourse.courseThumbnail = imageUpload.secure_url

//         await newCourse.save()

//         res.json({ success: true, message: 'Course Added' })

//     } catch (error) {

//         res.json({ success: false, message: error.message })

//     }
// }

// // Get Educator Courses
// export const getEducatorCourses = async (req, res) => {
//     try {

//         const educator = req.auth.userId

//         const courses = await Course.find({ educator })

//         res.json({ success: true, courses })

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

// // Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
// export const educatorDashboardData = async (req, res) => {
//     try {
//         const educator = req.auth.userId;

//         const courses = await Course.find({ educator });

//         const totalCourses = courses.length;

//         const courseIds = courses.map(course => course._id);

//         // Calculate total earnings from purchases
//         const purchases = await Purchase.find({
//             courseId: { $in: courseIds },
//             status: 'completed'
//         });

//         const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

//         // Collect unique enrolled student IDs with their course titles
//         const enrolledStudentsData = [];
//         for (const course of courses) {
//             const students = await User.find({
//                 _id: { $in: course.enrolledStudents }
//             }, 'name imageUrl');

//             students.forEach(student => {
//                 enrolledStudentsData.push({
//                     courseTitle: course.courseTitle,
//                     student
//                 });
//             });
//         }

//         res.json({
//             success: true,
//             dashboardData: {
//                 totalEarnings,
//                 enrolledStudentsData,
//                 totalCourses
//             }
//         });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };

// // Get Enrolled Students Data with Purchase Data
// export const getEnrolledStudentsData = async (req, res) => {
//     try {
//         const educator = req.auth.userId;

//         // Fetch all courses created by the educator
//         const courses = await Course.find({ educator });

//         // Get the list of course IDs
//         const courseIds = courses.map(course => course._id);

//         // Fetch purchases with user and course data
//         const purchases = await Purchase.find({
//             courseId: { $in: courseIds },
//             status: 'completed'
//         }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

//         // enrolled students data
//         const enrolledStudents = purchases.map(purchase => ({
//             student: purchase.userId,
//             courseTitle: purchase.courseId.courseTitle,
//             purchaseDate: purchase.createdAt
//         }));

//         res.json({
//             success: true,
//             enrolledStudents
//         });

//     } catch (error) {
//         res.json({
//             success: false,
//             message: error.message
//         });
//     }
// };


import { v2 as cloudinary } from 'cloudinary';
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express';

// ----------------------------
// Update Role to Educator
// ----------------------------
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized - No userId found' });
    }

    // Update Clerk user metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: 'educator' },
    });

    res.json({ success: true, message: 'You can publish a course now' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Add New Course
// ----------------------------
export const addCourse = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { courseData } = req.body;
    const imageFile = req.file;e

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!imageFile) return res.status(400).json({ success: false, message: 'Thumbnail not attached' });

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = userId;

    const newCourse = await Course.create(parsedCourseData);

    // Upload buffer to Cloudinary
    const imageUpload = await cloudinary.uploader.upload_stream(
      { folder: 'courses' },
      async (error, result) => {
        if (error) throw new Error(error.message);

        newCourse.courseThumbnail = result.secure_url;
        await newCourse.save();

        return res.json({ success: true, message: 'Course Added' });
      }
    );

    imageUpload.end(imageFile.buffer); // Send the buffer to Cloudinary
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ----------------------------
// Get Educator Courses
// ----------------------------
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = req.auth;

    const courses = await Course.find({ educator: userId });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Educator Dashboard Data
// ----------------------------
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId } = req.auth;

    const courses = await Course.find({ educator: userId });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    // Calculate total earnings
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    // Collect enrolled students data
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageUrl');
      students.forEach(student => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: { totalEarnings, enrolledStudentsData, totalCourses },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Get Enrolled Students with Purchase Data
// ----------------------------
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const { userId } = req.auth;

    const courses = await Course.find({ educator: userId });
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle');

    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
