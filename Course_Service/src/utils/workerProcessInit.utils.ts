import getVideoDurationInSeconds from "get-video-duration"
import { getRedisClient } from "../config/connectRedis.config"
import { UPLOAD_PATH, UPLOAD_VIDEO_TASK, WORKER_PROCESS_MESSAGE } from "../constants"
import { Files } from "formidable";
import * as path from "path";
import * as fs from "fs";
import { Worker } from "worker_threads";
import { course_modules } from "../models/module.schema";
import { spawn } from "child_process";


export const initVideoUploadWorkerProcess = async ({ files, moduleId, courseId }: { files: Files, moduleId: string, courseId: string }) => {
    const redisClient = getRedisClient()
    if (redisClient) {
        await redisClient?.hset(`module-${moduleId}`, {
            localVideoUrl: files?.video?.[0].filepath,
            isVideoAvailForStream: false,
            isAllSegmentCreated: false
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

                    await redisClient?.hset(`module-ref:${moduleId}`, {
                        s3VideoUrl: data.s3VideoUrl,
                        localVideoUrl: data.localVideoUrl,
                        localSegmentDataurl: ''
                    })

                    await course_modules.update({ video_url: data.localVideoUrl }, { where: { id: moduleId } })
                    await initFfmpegSegmentationEvent(moduleId)
                }
            }
        })
        return
    } else {
        console.error("❌ Unable To Get RedisClient")
        return
    }
}

const initFfmpegSegmentationEvent = async (moduleId: string) => {
    const redisClient = getRedisClient()
    let segmentCount = 0
    let redisDataUpdated = false
    const moduleData = await redisClient?.hgetall(`module-${moduleId}`)
    if (moduleData) {
        const localVideoUrl = moduleData.localVideoUrl
        console.log('localVideoUrl-->', localVideoUrl);

        const outputPath = path.join(__dirname, `../../uploads/HLS_DIR/${moduleId}`)
        if (!fs.existsSync(outputPath)) {
            await fs.mkdir(outputPath, { recursive: true }, (err) => { if (err) console.error("❌ Error Creating Folder ") })
        }
        const hlsPath = `${outputPath}/index.m3u8`

        // const childProcess = spawn(`ffmpeg -i ${localVideoUrl} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`)


        const childProcess = spawn("ffmpeg", [
            "-i", localVideoUrl,
            "-codec:v", "libx264",
            "-codec:a", "aac",
            "-hls_time", '10',
            "-hls_list_size", "0",
            '-hls_segment_filename', `${outputPath}/segment%03d.ts`,
            '-start_number', '0',
            hlsPath
        ])
        console.log("===================================FFMPEG Logs Starts===================================")
        childProcess.stdout.on("data", (data) => {
            console.log(data)
        })

        childProcess.stderr.on("data", async (data) => {
            const logVal: string = data.toString()
            if (logVal.includes(".ts")) {
                segmentCount += 1
            }

            if (segmentCount > 3 && !redisDataUpdated) {
                console.log("Redis Updated")
                redisDataUpdated = true
                await redisClient?.hset(`module-${moduleId}`, {
                    isVideoAvailForStream: true
                })
            }
        })

        childProcess.on("close", async (code) => {
            console.log(`Child Process Exited With Code: ${code}`)
            console.log(`Total Segments Created: ${segmentCount}`)
            await redisClient?.hset(`module-${moduleId}`, {
                isAllSegmentCreated: true
            })
            await redisClient?.hset(`module-ref:${moduleId}`, {
                localSegmentDataurl: outputPath
            })
        })

        childProcess.on('error', (err) => {
            console.error('Failed to start child process:', err);
        });
        return
    } else {
        console.error("❌ Unable To Get ModuleData From Redis")
        return
    }
}


const fileWatcher = () => { }