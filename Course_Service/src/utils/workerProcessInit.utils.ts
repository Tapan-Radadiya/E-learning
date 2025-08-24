import getVideoDurationInSeconds from "get-video-duration"
import { getRedisClient } from "../config/connectRedis.config"
import { UPLOAD_PATH, UPLOAD_VIDEO_TASK, WORKER_PROCESS_MESSAGE } from "../constants"
import { Files } from "formidable";
import * as path from "path"
import { Worker } from "worker_threads";
import { course_modules } from "../models/module.schema";

export const initVideoUploadWorkerProcess = async ({ files, moduleId, courseId }: { files: Files, moduleId: string, courseId: string }) => {
    const redisClient = getRedisClient()


    await redisClient?.hset(`module-${moduleId}`, {
        localVideoUrl: files?.video?.[0].filepath,
    })

    console.log("Worker Process Started . . .")

    const worker = new Worker(
        path.join(__dirname, "../worker_scripts/download_module_video.js")
    )

    const mimeType: string[] = files?.video?.[0].mimetype?.split("/") ?? []
    const workerFileData = {
        oldFilePath: files?.video?.[0].filepath,
        newFilePath: `${UPLOAD_PATH}/${moduleId}.${mimeType[mimeType?.length - 1]}`,
        moduleId: moduleId,
        course_id: courseId,
        mimeType: files?.video?.[0].mimetype,
        fileName: files?.video?.[0].originalFilename
    }

    worker.postMessage({ task: UPLOAD_VIDEO_TASK, data: workerFileData })

    worker.on("error", (err) => {
        console.log('err-->', err);
    })

    worker.on("message", async (message) => {
        if (message === WORKER_PROCESS_MESSAGE.SUCCESS) {
            const data = await redisClient?.hgetall(`module-${moduleId}`)
            if (data) {
                const videoDuration = await getVideoDurationInSeconds(data.localVideoUrl)
                await redisClient?.expire(`module-${moduleId}`, videoDuration.toFixed())
                await redisClient?.hset(`module-ref:${moduleId}`, { s3VideoUrl: data.s3VideoUrl, localVideoUrl: data.localVideoUrl })
                course_modules.update({ video_url: data.localVideoUrl }, { where: { id: moduleId } })
            }
        }
    })
}