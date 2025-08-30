import express from "express"
import { AuthenticateUser, AuthorizeUser } from "shared-middleware"
import { AddCourseModule, fetchCourseModules, removeModule, updateModules, getModuleDetails, getM3U8FileDetails } from "../controller/course_module.controller"
import { Role } from "shared-middleware/dist/utils/comman"
const router = express.Router()

router.route('/add-module/:courseId').post(AuthenticateUser, AuthorizeUser([Role.ADMIN]), AddCourseModule)
router.route('/remove-module/:moduleId').delete(AuthenticateUser, AuthorizeUser([Role.ADMIN]), removeModule)
router.route('/get-all-modules/:courseId').get(AuthenticateUser, fetchCourseModules)
router.route('/update-modules/:moduleId').put(AuthenticateUser, AuthorizeUser([Role.ADMIN]), updateModules)
// router.route('/get-module-details/:moduleId').get(AuthenticateUser, getModuleDetails)
router.route('/get-module-details/:moduleId').get(getModuleDetails)
router.route('/get-module-url/:moduleId').get(getM3U8FileDetails)
export default router