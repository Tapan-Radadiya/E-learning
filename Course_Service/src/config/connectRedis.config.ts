import Redis from "ioredis"
import { course_modules } from "../models/module.schema"
import * as fs from "fs"

let redisClient: Redis | null = null

export const initRedisClient = async () => {
    redisClient = new Redis({ host: '127.0.0.1', port: 6381 })

    redisClient.on("connect", () => {
        console.log("Redis Client Connected 127.0.01:6381")
    })

    redisClient.on('error', (err) => {
        console.error('Redis Connection Error', err);
    });

}


export const getRedisClient = () => {
    if (!redisClient) {
        return null
    }
    return redisClient
}

export const detectDeletedKeys = async () => {
    const sub = new Redis({ host: '127.0.0.1', port: 6381 })

    sub.psubscribe("__keyevent@0__:expired");

    const redisClient = getRedisClient()

    if (!redisClient) {
        console.log("Got RedisClient Null ")
        return
    }

    sub.on("pmessage", async (pattern: any, channel: any, message: string) => {
        if (message.startsWith("module-")) {
            const moduleId = message.replace("module-", "")
            const s3UrlData = await redisClient.hget(`module-ref:${moduleId}`, "s3VideoUrl")
            const localVideoUrl = await redisClient.hget(`module-ref:${moduleId}`, "localVideoUrl")

            const updateData = await course_modules.update({
                is_module_live: false,
                video_url: s3UrlData
            }, { where: { id: moduleId } })

            if (localVideoUrl) {
                fs.unlink(localVideoUrl, (err) => {
                    if (err) {
                        console.log("Error Removing LocalVideo", err)
                    }
                })
            }


            await redisClient.del(`module-ref:${moduleId}`)
        }
    })
    console.log("=====================Key Deletion Detection Enabled(redis)=====================")
}