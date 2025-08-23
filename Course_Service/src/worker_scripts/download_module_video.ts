import { parentPort } from "worker_threads"
import { UploadFileToS3 } from "../utils/awsS3.utils"
import * as fs from "fs"

import { getRedisClient, initRedisClient } from "../config/connectRedis.config"

parentPort?.on("message", async (message) => {
    if (message.task === 'UPLOAD_VIDEO_LOCAL_AND_S3') {
        try {
            const redisClient = getRedisClient()

            const { oldFilePath, newFilePath, moduleId, course_id, mimeType, fileName } = message.data
            const readStream = fs.createReadStream(oldFilePath)

            await uploadToLocal(oldFilePath, newFilePath)

            const s3FileName = `moduleVideo/${course_id}/${Date.now()} - ${fileName ?? ''}`
            await UploadFileToS3({
                key: s3FileName,
                body: readStream,
                contentType: mimeType
            })

            await redisClient?.hset(`module-${moduleId}`, "s3VideoUrl", s3FileName)
            await redisClient?.hset(`module-${moduleId}`, "videoUploadedTime", Date.now())
            await redisClient?.hset(`module-${moduleId}`, "localVideoUrl", newFilePath)
            parentPort?.postMessage("ALL_PROCESS_COMPLETED_SUCCESSFULLY")

        } catch (error) {
            console.log('error-->', error);
            parentPort?.postMessage("ERROR_COMPLETING_PROCESS")
        }
    }
})

const uploadToLocal = async (oldFilePath: string, newFilePath: string): Promise<boolean> => {
    const promiseRes: boolean = await new Promise((res, rej) => {
        fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
                rej(false)
            } else {
                res(true)
            }
        })
    })
    return promiseRes
}

(async () => {
    await initRedisClient()
})();