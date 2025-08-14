import express from "express"
import { EnrollUser, getAllEnrollmentUsers } from "../controller/enrollment.controller"
import { AuthenticateUser, AuthorizeUser } from "shared-middleware"
import { Role } from "../constants"
const router = express.Router()

router.route("/enroll-user/:courseId").post(AuthenticateUser, EnrollUser)
router.route('/course-enrollment-data/:courseId').get(AuthenticateUser, AuthorizeUser([Role.ADMIN]), getAllEnrollmentUsers)
export default router