import { EMAIL_TYPE, SQS_MESSAGE_GROUP_ID } from "../constants";

export interface ApiResultInterface {
    message: string,
    statusCode?: number,
    data?: any,
    err?: Error
}

export interface SQSEmailDataPushInterface {
    to: string,
    body: string,
    subject: string,
    emailType: EMAIL_TYPE,
    messageGroupId: SQS_MESSAGE_GROUP_ID
}