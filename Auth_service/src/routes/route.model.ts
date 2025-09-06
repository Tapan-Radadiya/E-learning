import express from "express"
import { createUserController, loginUser, refreshTokenData, getUserProfile, enableMFA } from "../controller/index.controller"
import { AuthenticateUser } from 'shared-middleware';

const router = express.Router()

router.route('/add-user').post(createUserController)
router.route('/login').post(loginUser)
router.route('/refresh').get(refreshTokenData)
router.route('/enable-mfa').post(enableMFA)
router.route('/get-profile').get(AuthenticateUser, getUserProfile)
export default router