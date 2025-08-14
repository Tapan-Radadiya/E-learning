import express from "express"
import { updateUserProgress } from "../controller/courseProgress.controller"
import { AuthenticateUser } from "shared-middleware"
const router = express.Router()


router.route('/upgrade-progress/:moduleId').patch(AuthenticateUser, updateUserProgress)
export default router