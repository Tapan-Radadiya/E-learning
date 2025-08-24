import { Request, Response } from "express"
import { ApiResult, getFileSize } from "../utils/comman"
import { AddCourseModuleService, getAllCourseModuleService, getModuleDetailsService, removeCourseModuleService, updateCourseModuleService } from "../services/course_module.service"
import { validate as uuidvalidate } from "uuid"
import * as path from "path"
import * as fs from "fs"
const initRange = `bytes=0-`
const CHUNK_SIZE = 10 ** 6

const AddCourseModule = async (req: Request, res: Response) => {
    try {
        const data = await AddCourseModuleService(req)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const removeModule = async (req: Request, res: Response) => {
    const { moduleId } = req.params

    try {
        const data = await removeCourseModuleService(moduleId)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const fetchCourseModules = async (req: Request, res: Response) => {
    const { courseId } = req.params

    try {
        const data = await getAllCourseModuleService(courseId)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const updateModules = async (req: Request, res: Response) => {
    try {
        const data = await updateCourseModuleService(req)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const getModuleDetails = async (req: Request, res: Response) => {
    const { moduleId } = req.params
    try {
        if (!uuidvalidate(moduleId)) {
            res.status(409).json(ApiResult({ message: "Invalid Module Id" }))
            return
        }

        const data = await getModuleDetailsService(moduleId)
        if (data.statusCode === 200) {
            // If Module Is Live Then The Video Will Be "Streamed" From The Local
            if (data.data.is_module_live) {

                const videoPath = path.join(__dirname, "../uploads/YtTestVideo.mp4")
                // const fileData = await getFileSize(data.data.video_url)
                const fileData = await getFileSize(videoPath)
                if (fileData) {
                    const range: string = req.headers.range!;

                    const fileSize = fileData.size
                    const startChunk = range.replace(/bytes=/, "").split("-")[0];
                    const start = parseInt(startChunk)
                    const end = Math.min(start + CHUNK_SIZE, fileSize - 1)
                    const contentLength = end - start + 1
                    const headers = {
                        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                        "Accept-Ranges": "bytes",
                        "Content-Length": contentLength,
                        "Content-Type": "video/mp4"
                    }
                    res.writeHead(206, headers)
                    const videoStream = fs.createReadStream(videoPath, { start, end })
                    videoStream.pipe(res)
                } else {
                    res.status(409).json(ApiResult({ statusCode: 409, message: "Error Starting Video Stream" }))
                }
            } else {
                res.status(data.statusCode!).json(data)
                return
            }
        } else {
            // If Module Is Not Live Then The Video Will Be "Served" From The S3
            res.status(data.statusCode!).json(data)
            return
        }
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

export {
    AddCourseModule,
    removeModule,
    fetchCourseModules,
    updateModules,
    getModuleDetails
}