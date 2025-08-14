import express from "express"
import { createCourse, getAllCourses, deleteCourse, updateCourse } from "../controller/course.controller"
import { AuthenticateUser, AuthorizeUser } from "shared-middleware"
import { Role } from "../constants"
const router = express.Router()

router.route('/create-course').post(AuthenticateUser, AuthorizeUser([Role.ADMIN]), createCourse)
router.route('/course/:courseId').get(AuthenticateUser, getAllCourses)
router.route('/delete-course/:courseId').delete(AuthenticateUser, AuthorizeUser([Role.ADMIN]), deleteCourse)
router.route('/update-course/:courseId').put(AuthenticateUser, AuthorizeUser([Role.ADMIN]), updateCourse)
export default router