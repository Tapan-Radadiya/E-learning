import crypto from "crypto"
import { EMAIL_TYPE, Role, SALT } from "../constants"
import { ZodSchema } from "zod"
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import ms from "ms"
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import { ApiResultInterface, SQSEmailDataPushInterface } from "../interfaces/common.interface"


export const ApiResult = (data: ApiResultInterface) => {
    return {
        message: data.message,
        statusCode: data.statusCode,
        data: data.data,
        err: data.err
    }
}

export const hashText = async (plainText: string) => {

    const hash = await new Promise((resolve, reject) => {
        crypto.pbkdf2(plainText, SALT, 10000, 64, 'sha256', (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data.toString('hex'))
        })
    })
    return hash
}

export const compareText = async (plainText: string, hashedText: string): Promise<Boolean> => {
    const hash = await hashText(plainText)
    return hash === hashedText
}

export const generateAccessToken = async (jwtPayload: { id: string, email: string, role: Role }) => {
    const access_secret: string = process.env.JWT_ACCESS_KEY_SECRET! as string
    const access_secret_TTL = process.env.JWT_ACCESS_KEY_TTL as ms.StringValue
    const signedToken = jwt.sign(jwtPayload, access_secret, {
        expiresIn: access_secret_TTL,
        algorithm: 'HS256'
    })
    return signedToken
}

export const generateRefreshToken = async (jwtPayload: { email: string }) => {
    const refresh_secret: string = process.env.JWT_REFRESH_KEY_SECRET! as string
    const refresh_secret_TTL = process.env.JWT_REFRESH_KEY_TTL as ms.StringValue

    const refreshToken = jwt.sign({ email: jwtPayload.email }, refresh_secret, {
        expiresIn: refresh_secret_TTL
    })
    return refreshToken
}

export const validateJWT = async (jwtToken: string, type: 'ACCESS' | 'REFRESH') => {
    const SECRET_KEY = type === 'ACCESS' ? process.env.JWT_ACCESS_KEY_SECRET! as string : process.env.JWT_REFRESH_KEY_SECRET
    const validJWT = jwt.verify(jwtToken, SECRET_KEY!)
    return validJWT
}

export const decodeJWT = async (jwtToken: string, type: 'ACCESS' | 'REFRESH'): Promise<JwtPayload> => {
    const SECRET_KEY = type === 'ACCESS' ? process.env.JWT_ACCESS_KEY_SECRET! as string : process.env.JWT_REFRESH_KEY_SECRET
    const decodedJWT = jwt.verify(jwtToken, SECRET_KEY!) as JwtPayload
    return decodedJWT
}

export const validateWithZod = (zodSchema: any, value: any): { success: boolean, message?: Object } => {
    const data = zodSchema.safeParse(value)
    if (!data.success) {
        return { success: false, message: data.error.flatten().fieldErrors }
    }
    return { success: true }
}

// export const pushDataToSQS = async (sqsData: SQSEmailDataPushInterface) => {
//     const sqsClient = new SQSClient({
//         region: process.env.AWS_REGION,
//         credentials: {
//             accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//             secretAccessKey: process.env.AWS_SECRET_KEY_ID!
//         }
//     })

//     const sendMsg = new SendMessageCommand({
//         MessageBody: JSON.stringify(sqsData),
//         QueueUrl: process.env.AWS_SQS_QUERY_URL,
//         MessageGroupId: sqsData.messageGroupId,
//         MessageDeduplicationId: `dedup-${crypto.randomUUID()}`
//     })

//     const res = await sqsClient.send(sendMsg)
//     console.log('res.MessageId->', res.MessageId)
// }