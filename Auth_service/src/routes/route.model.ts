import express from "express"
import { createUserController, loginUser, refreshTokenData, getUserProfile, enableMFA, createOrganization } from "../controller/index.controller"
import { AuthenticateUser, AuthorizeUser } from 'shared-middleware';

const router = express.Router()

router.route('/create-org').post(AuthenticateUser, AuthorizeUser(['SUPER_ADMIN']), createOrganization)
router.route('/add-user').post(createUserController)
router.route('/login').post(loginUser)
router.route('/refresh').get(refreshTokenData)
router.route('/enable-mfa').post(enableMFA)
router.route('/get-profile').get(AuthenticateUser, getUserProfile)

export default router