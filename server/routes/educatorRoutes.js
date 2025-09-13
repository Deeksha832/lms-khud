// import express from 'express'
// import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js';
// import upload from '../configs/multer.js';
// import { protectEducator } from '../middlewares/authMiddleware.js';
// import { ClerkExpressRequireAuth } from "@clerk/express"


// const educatorRouter = express.Router()

// // Add Educator Role 
// educatorRouter.get('/update-role', updateRoleToEducator)

// // Add Courses 
// educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)

// // Get Educator Courses 
// educatorRouter.get('/courses', protectEducator, getEducatorCourses)

// // Get Educator Dashboard Data
// educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)

// // Get Educator Students Data
// educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)


// export default educatorRouter;

import express from "express"
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator
} from "../controllers/educatorController.js"
import upload from "../configs/multer.js"
import { protectEducator } from "../middlewares/authMiddleware.js"
import { requireAuth } from "@clerk/express";
const educatorRouter = express.Router()

// Add Educator Role
educatorRouter.get("/update-role", requireAuth(), updateRoleToEducator)

// Add Courses
educatorRouter.post(
  "/add-course",
  requireAuth(),
  protectEducator,
  upload.single("image"),
  addCourse
)

// Get Educator Courses
educatorRouter.get("/courses", requireAuth(), protectEducator, getEducatorCourses)

// Get Educator Dashboard Data
educatorRouter.get("/dashboard", requireAuth(), protectEducator, educatorDashboardData)

// Get Educator Students Data
educatorRouter.get("/enrolled-students", requireAuth(), protectEducator, getEnrolledStudentsData)

export default educatorRouter
