import { Request, Response } from "express"
import { ApiResult, getFileSize } from "../utils/comman"
import { AddCourseModuleService, getAllCourseModuleService, getM3U8FileDetailsService, getModuleDetailsService, removeCourseModuleService, updateCourseModuleService } from "../services/course_module.service"
import { validate as uuidvalidate } from "uuid"
import * as path from "path"
import * as fs from "fs"

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
        res.status(data.statusCode!).json(data)

        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const getM3U8FileDetails = async (req: Request, res: Response) => {
    const { moduleId } = req.params
    try {
        if (!uuidvalidate(moduleId)) {
            res.status(409).json(ApiResult({ message: "Invalid Module Id" }))
            return
        }

        const data = await getM3U8FileDetailsService(moduleId)
        if (data.statusCode === 206) {
            res.type("application/vnd.apple.mpegurl").send(data.data)
            return
        } else {
            res.status(data.statusCode!).json(data)
            return
        }
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}


const testCustomm3u8File = async (req: Request, res: Response) => {
    const { moduleId } = req.params

    try {
        if (!uuidvalidate(moduleId)) {
            res.status(409).json(ApiResult({ message: "Invalid Module Id" }))
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
    getModuleDetails,
    getM3U8FileDetails
}