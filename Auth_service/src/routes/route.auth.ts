import express from "express"
import { OauthMiddleware, googleOauthCallbackhandler } from "../middleware/oauth.middleware";

const router = express.Router()

router.route('/google').get(OauthMiddleware)
router.route('/callback').get(googleOauthCallbackhandler)

export default router