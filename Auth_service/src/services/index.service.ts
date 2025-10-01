import qrcode from "qrcode"
import { Op, where } from "sequelize"
import speakeasy from "speakeasy"
import { EMAIL_TYPE, Role, SPEAKEASY_CONFIG, SQS_MESSAGE_GROUP_ID } from "../constants"
import { ApiResultInterface } from "../interfaces/common.interface"
import { ApiResult, compareText, decodeJWT, generateAccessToken, generateRefreshToken, hashText, validateJWT } from "../utils/comman"
import { triggerUserXpEvent } from "../GrpcServices/client/grpc.client"
import { pushDataToSQS } from "shared-middleware/dist/utils/comman"
import { NEW_USER_EMAIL_TEMPLATE } from "../EmailTemplates/emailTemplates"
import { db } from "../config/connectDb"
import { tbl_user, tbl_user_refresh_tokens } from "../db"
import { and, eq, inArray } from "drizzle-orm"

const addUserService = async (userBody: { display_name: string, email: string, password: string, role: Role }): Promise<ApiResultInterface> => {
    const isUserExist = await db.query
        .tbl_user
        .findFirst({
            where: (
                and(
                    eq(tbl_user.email, userBody.email),
                    eq(tbl_user.display_name, userBody.display_name)
                )
            )
        })
    if (isUserExist) {
        return ApiResult({ message: "User With Email Or Display_Name Already Exists", statusCode: 409 })
    }

    const secret = await speakeasy.generateSecret({ ...SPEAKEASY_CONFIG, name: userBody.email })

    if (!secret.otpauth_url) {
        return ApiResult({ message: "Error Registering User Try AFter SomeTime", statusCode: 409 })
    }

    const userCreate = await db.transaction(async (tx) => {
        const userData = await tx.insert(tbl_user)
            .values({
                display_name: userBody.display_name,
                email: userBody.email,
                password: await hashText(userBody.password),
                user_role: userBody.role,
                is_mfa_enabled: false
            })
            .returning({
                id: tbl_user.id,
                email: tbl_user.email,
                display_name: tbl_user.display_name
            })

        await tx.insert(tbl_user_refresh_tokens)
            .values({
                speakeasy_key: secret.base32, user_id: userData[0].id, refresh_token: ''
            })
        return userData[0]

    })

    if (userCreate) {
        const qrCodeUrl = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${userBody.email}`,
            issuer: "E-Learning",
            encoding: "base32"
        })
        const qrCodeData = await qrcode.toDataURL(qrCodeUrl)

        // const data: any = await triggerUserXpEvent({ xpEvent: "NEW_REGISTER", userId: userCreate.id })
        // if (data) {
        //     await pushDataToSQS({
        //         to: userBody.email,
        //         body: NEW_USER_EMAIL_TEMPLATE(userBody.display_name, data.xp_point as number),
        //         subject: "Welcome Message",
        //         emailType: EMAIL_TYPE.USER_CREATION,
        //         messageGroupId: SQS_MESSAGE_GROUP_ID.Email_Sending
        //     })
        // }


        return ApiResult({ message: "User Created Successfully Scan The QR To Enable MFA", statusCode: 201, data: { qrCodeData, userData: userCreate } })
    } else {
        return ApiResult({ message: "Error Creating User Try After SomeTime", statusCode: 409, err: userCreate })
    }
}


const enableMFAService = async (body: { userEmailId: string, password: string, otp: string }): Promise<ApiResultInterface> => {
    const validateLogin = await db
        .query
        .tbl_user
        .findFirst({
            where: (
                eq(tbl_user.email, body.userEmailId)
            )
        })
    if (!validateLogin) {
        return ApiResult({ message: "Unable To Found User", statusCode: 404 })
    }
    if (validateLogin.is_mfa_enabled) {
        return ApiResult({ message: "MultiFactor Authentication Is Already Enabled", statusCode: 404 })
    }

    if (await !compareText(body.password, validateLogin.password)) {
        return ApiResult({ message: "Invalid credentials", statusCode: 403 })
    }

    const userTokenData = await db
        .query
        .tbl_user_refresh_tokens
        .findFirst({
            where: (
                eq(tbl_user_refresh_tokens.user_id, validateLogin.id)
            )
        })
    if (!userTokenData) {
        return ApiResult({ message: "Unable To Found User", statusCode: 404 })
    }

    const verify = validateValidMFAOtp(userTokenData.speakeasy_key!, body.otp)

    if (verify) {
        await db
            .update(tbl_user)
            .set({ is_mfa_enabled: true })
            .where(
                eq(tbl_user.id, validateLogin.id)
            )
        return ApiResult({ message: "Multi Factor Authentication Is Enabled Please Login", statusCode: 200 })
    } else {
        return ApiResult({ message: "Invalid MFA Code Or Error Eanbling Multi Factor Authentication Please Try After SomeTime", statusCode: 409 })
    }

}

const loginUserService = async (userLoginBody: { email: string, password: string, otp: string }): Promise<ApiResultInterface> => {
    // const validateLogin = await user.findOne({ where: { email: userLoginBody.email } })

    const validateLogin = await db.query.tbl_user.findFirst({
        where: (
            eq(tbl_user.email, userLoginBody.email)
        )
    })
    if (!validateLogin) {
        return ApiResult({ message: "Unable To Found User", statusCode: 404 })
    }

    if (!validateLogin.is_mfa_enabled) {
        return ApiResult({ message: "Please Enable MFA", statusCode: 404 })
    }

    if (await !compareText(userLoginBody.password, validateLogin.password)) {
        return ApiResult({ message: "Invalid credentials", statusCode: 403 })
    }
    const userTokenData = await db
        .query
        .tbl_user_refresh_tokens
        .findFirst({
            where: (
                eq(tbl_user_refresh_tokens.user_id, validateLogin.id)
            )
        })
    if (!userTokenData) {
        return ApiResult({ message: "Unable To Found User", statusCode: 404 })
    }

    const mfaVarification = validateValidMFAOtp(userTokenData.speakeasy_key!, userLoginBody.otp)

    if (!mfaVarification) {
        return ApiResult({ message: "Invalid MFA Code", statusCode: 403 })
    }

    const accessToken = await generateAccessToken({
        id: validateLogin.id,
        email: validateLogin.email,
        role: validateLogin.user_role as Role,
        mfa: true
    })
    const refreshToken = await generateRefreshToken({ email: validateLogin.email })

    await db
        .insert(tbl_user_refresh_tokens)
        .values({ refresh_token: refreshToken, user_id: validateLogin.id })
        .onConflictDoUpdate({
            target: tbl_user_refresh_tokens.user_id,
            set: { refresh_token: refreshToken }
        })

    return ApiResult({ message: "User Logged In Successfully", statusCode: 200, data: { accessToken, refreshToken } })
}


const reevaluteRefreshToken = async (refreshToken: string): Promise<ApiResultInterface> => {
    try {
        const isValidJWT = await validateJWT(refreshToken, 'REFRESH')

        if (isValidJWT) {

            const data: any = await decodeJWT(refreshToken, 'REFRESH')
            const userDetails = await db.query.tbl_user.findFirst({
                where: (
                    eq(tbl_user.email, data.email)
                )
            })
            if (userDetails) {
                const userRefreshTokensData = await db.query.tbl_user_refresh_tokens.findFirst({
                    where: (
                        and(
                            eq(tbl_user_refresh_tokens.user_id, userDetails.id),
                            eq(tbl_user_refresh_tokens.refresh_token, refreshToken)
                        )
                    )
                })

                if (userRefreshTokensData) {
                    const newAccessToken = await generateAccessToken({ email: userDetails.email, id: userDetails.id, role: userDetails.user_role as Role, mfa: userDetails.is_mfa_enabled })
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
    const getUserData = await db.query.tbl_user.findFirst({
        where: (eq(tbl_user.id, userId))
    })
    if (getUserData) {
        return ApiResult({ message: "User Found", statusCode: 200, data: getUserData })
    } else {
        return ApiResult({ message: "No User Found", statusCode: 404 })
    }
}

const getUserProfilesGrpcService = async (userId: string[]): Promise<ApiResultInterface> => {
    try {
        const getUserData = await db
            .select({
                id: tbl_user.id,
                display_name: tbl_user.display_name,
                email: tbl_user.email,
                user_role: tbl_user.user_role
            })
            .from(tbl_user)
            .where(inArray(tbl_user.id, userId))
        return ApiResult({ message: "Data Fetched", statusCode: 200, data: getUserData })
    } catch (error) {
        return ApiResult({ message: "Internal Server Error", statusCode: 500 })
    }
}



const validateValidMFAOtp = (speakeasy_key: string, otp: string): boolean => {
    return speakeasy.totp.verify({
        secret: speakeasy_key,
        encoding: "base32",
        token: otp
    })
}
export {
    addUserService, enableMFAService, getUserProfileService,
    getUserProfilesGrpcService, loginUserService,
    reevaluteRefreshToken
}
