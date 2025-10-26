import speakeasy from "speakeasy"
export const SALT = 'lionlovesgrass'

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
}


export enum EMAIL_TYPE {
    USER_CREATION = "USER_CREATION"
}

export enum SQS_MESSAGE_GROUP_ID {
    Email_Sending = "Email_Sending"
}

export const SPEAKEASY_CONFIG: speakeasy.GenerateSecretOptions = {
    length: 20,
    issuer: "E-Learning",
    otpauth_url: true
}