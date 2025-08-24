import * as path from "path"
export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export const UPLOAD_PATH = path.join(__dirname, "../../uploads")

// For Windows
export const TEMP_UPLOAD_PATH = path.join(__dirname, "temp_uploads")

export const UPLOAD_VIDEO_TASK = "UPLOAD_VIDEO_LOCAL_AND_S3"

export const WORKER_PROCESS_MESSAGE = {
    SUCCESS: 'ALL_PROCESS_COMPLETED_SUCCESSFULLY',
    FAILURE: 'ERROR_COMPLETING_PROCESS'
}