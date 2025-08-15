import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs"

import jwt, { JwtPayload } from "jsonwebtoken"
export interface ApiResultInterface {
    message: string,
    statusCode?: number,
    data?: any,
    err?: Error
}

export enum EMAIL_TYPE {
    USER_CREATION = "USER_CREATION"
}

export enum SQS_MESSAGE_GROUP_ID {
    Email_Sending = "Email_Sending"
}

export interface SQSEmailDataPushInterface {
    to: string,
    body: string,
    subject: string,
    emailType: EMAIL_TYPE,
    messageGroupId: SQS_MESSAGE_GROUP_ID
}

export const ApiResult = (data: ApiResultInterface) => {
    return {
        message: data.message,
        statusCode: data.statusCode,
        data: data.data,
        err: data.err
    }
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export const decodeJWT = async (jwtToken: string, type: 'ACCESS' | 'REFRESH'): Promise<JwtPayload> => {
    const SECRET_KEY = type === 'ACCESS' ? process.env.JWT_ACCESS_KEY_SECRET! as string : process.env.JWT_REFRESH_KEY_SECRET
    const decodedJWT = jwt.verify(jwtToken, SECRET_KEY!) as JwtPayload
    return decodedJWT
}


export const pushDataToSQS = async (sqsData: SQSEmailDataPushInterface) => {

    const sqsClient = new SQSClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_KEY_ID!
        }
    })

    const sendMsg = new SendMessageCommand({
        MessageBody: JSON.stringify(sqsData),
        QueueUrl: process.env.AWS_SQS_QUERY_URL,
        MessageGroupId: sqsData.messageGroupId,
        MessageDeduplicationId: `dedup-${crypto.randomUUID()}`
    })

    const res = await sqsClient.send(sendMsg)
    console.log('res.MessageId->', res.MessageId)
}