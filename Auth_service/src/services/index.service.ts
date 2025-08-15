import { Op } from "sequelize"
import { EMAIL_TYPE, Role, SQS_MESSAGE_GROUP_ID } from "../constants"
import { user } from "../schema/user.schema"
import { userRefreshTokens } from "../schema/user_refresh_token.schema"
import { ApiResult, decodeJWT, generateAccessToken, generateRefreshToken, hashText, validateJWT } from "../utils/comman"
import { ApiResultInterface } from "../interfaces/common.interface"
import { triggerUserXpEvent } from "../GrpcServices/client/grpc.client"
import { NEW_USER_EMAIL_TEMPLATE } from "../EmailTemplates/emailTemplates"
import { pushDataToSQS } from "shared-middleware/dist/utils/comman"

const addUserService = async (userBody: { display_name: string, email: string, password: string, role: Role }): Promise<ApiResultInterface> => {
    const isUserExist = await user.findOne({ where: { email: userBody.email, display_name: userBody.display_name }, raw: true })
    if (isUserExist) {
        return ApiResult({ message: "User With Email Or Display_Name Already Exists", statusCode: 409 })
    }
    const userCreate = await user.create({
        display_name: userBody.display_name,
        email: userBody.email,
        password: await hashText(userBody.password),
        user_role: userBody.role
    }, { raw: true })
    if (userCreate) {
        const data: any = await triggerUserXpEvent({ xpEvent: "NEW_REGISTER", userId: userCreate.toJSON().id })
        if (data) {
            await pushDataToSQS({
                to: userBody.email,
                body: NEW_USER_EMAIL_TEMPLATE(userBody.display_name, data.xp_point as number),
                subject: "Welcome Message",
                emailType: EMAIL_TYPE.USER_CREATION,
                messageGroupId: SQS_MESSAGE_GROUP_ID.Email_Sending
            })
        }
        return ApiResult({ message: "User Created Successfully", statusCode: 201, data: userCreate.toJSON() })
    } else {
        return ApiResult({ message: "Error Creating User Try After SomeTime", statusCode: 409, err: userCreate })
    }
}

const loginUserService = async (userLoginBody: { email: string, password: string }): Promise<ApiResultInterface> => {
    const validateLogin: any = await user.findOne({ where: { email: userLoginBody.email }, raw: true })
    if (!validateLogin) {
        return ApiResult({ message: "Unable To Found User", statusCode: 404 })
    }

    const accessToken = await generateAccessToken({ id: validateLogin.id, email: validateLogin.email, role: validateLogin.user_role })
    const refreshToken = await generateRefreshToken({ email: validateLogin.email })
    const addUserRefreshToken = await userRefreshTokens.upsert({
        user_id: validateLogin.id,
        refresh_token: refreshToken
    }, {})
    return ApiResult({ message: "User Logged In Successfully", statusCode: 200, data: { accessToken, refreshToken } })
}

const reevaluteRefreshToken = async (refreshToken: string): Promise<ApiResultInterface> => {
    try {
        const isValidJWT = await validateJWT(refreshToken, 'REFRESH')

        if (isValidJWT) {

            const data: any = await decodeJWT(refreshToken, 'REFRESH')
            const userDetails: any = await user.findOne({ where: { email: data.email }, raw: true })

            if (userDetails) {
                const userRefreshTokensData = await userRefreshTokens.findOne({ where: { user_id: userDetails.id, refresh_token: refreshToken } })
                if (userRefreshTokensData?.toJSON()) {
                    const newAccessToken = await generateAccessToken({ email: userDetails.email, id: userDetails.id, role: userDetails.user_role })
                    return ApiResult({ message: "New Access Token Generated", statusCode: 200, data: { accessToken: newAccessToken } })
                }
            }
            return ApiResult({ message: "Unable To Fetch UserDetails", statusCode: 400 })
        } else {
            return ApiResult({ message: "Invalid Refresh Token", statusCode: 401 })
        }
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return ApiResult({ message: "Refresh Token Expired", statusCode: 401 })
        }
        console.log('error->', error)
        return ApiResult({ message: "ServerError", statusCode: 500 })
    }
}

const getUserProfileService = async (userId: string): Promise<ApiResultInterface> => {
    const getUserData = await user.findOne({ where: { id: userId }, raw: true })
    if (getUserData) {
        return ApiResult({ message: "User Found", statusCode: 200, data: getUserData })
    } else {
        return ApiResult({ message: "No User Found", statusCode: 404 })
    }
}

const getUserProfilesGrpcService = async (userId: string[]): Promise<ApiResultInterface> => {
    try {
        const getUserData = await user.findAll({
            where: {
                id: {
                    [Op.in]: userId
                }
            },
            attributes: ['id', 'display_name', 'email', 'user_role'],
            raw: true
        })
        console.log('getUserData-->', getUserData);
        return ApiResult({ message: "Data Fetched", statusCode: 200, data: getUserData })
    } catch (error) {
        return ApiResult({ message: "Internal Server Error", statusCode: 500 })
    }
}
export { addUserService, loginUserService, reevaluteRefreshToken, getUserProfileService, getUserProfilesGrpcService }